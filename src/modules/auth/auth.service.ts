import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userName } });

    if (
      user &&
      user.passwordHash &&
      (await bcrypt.compare(password, user.passwordHash))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }

    throw new HttpException(
      'Usuário ou senha inválidos',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async login(user: User) {
    const payload = {
      sub: user.subjectId,
      userName: user.userName,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
