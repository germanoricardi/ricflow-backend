import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    userName: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOne({ where: { userName } });

    if (
      user &&
      user.passwordHash &&
      (await bcrypt.compare(password, user.passwordHash))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    }

    throw new HttpException(
      'Usuário ou senha inválidos',
      HttpStatus.UNAUTHORIZED,
    );
  }

  generateTokens(user: Omit<User, 'passwordHash'>) {
    const accessPayload = {
      sub: user.subjectId,
      userName: user.userName,
      email: user.email,
    };

    const access_token = this.jwtService.sign(accessPayload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expirationTime'),
    });

    const refreshPayload = {
      sub: user.subjectId,
      userName: user.userName,
      email: user.email,
    };

    const refresh_token = new JwtService({
      secret: this.configService.get('jwt.refreshSecret'),
    }).sign(refreshPayload);

    return { access_token, refresh_token };
  }

  async login(user: Omit<User, 'passwordHash'>) {
    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string) {
    const payload = await new JwtService({
      secret: this.configService.get('jwt.refreshSecret'),
    }).verifyAsync(refreshToken);

    const user = await this.userRepository.findOne({
      where: { subjectId: payload.sub },
    });

    if (!user) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }

    return this.generateTokens(user);
  }
}
