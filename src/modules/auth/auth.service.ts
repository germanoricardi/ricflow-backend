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

  /**
   * Validates user credentials by checking if the provided username and password
   * match a record in the database.
   *
   * @param userName - The username provided by the user
   * @param password - The plain text password provided by the user
   * @returns The user object excluding the password hash, if validation is successful
   * @throws HttpException if the username or password is invalid
   */
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

  /**
   * Generates access and refresh JWT tokens for the authenticated user.
   *
   * @param user - The user object excluding the password hash
   * @returns An object containing the access_token and refresh_token
   */
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
    }).sign(refreshPayload, {
      expiresIn: this.configService.get('jwt.refreshExpirationTime'),
    });

    return { access_token, refresh_token };
  }

  /**
   * Authenticates the user and returns access and refresh tokens.
   *
   * @param user - The user object excluding the password hash
   * @returns An object containing the access_token and refresh_token
   */
  async login(user: Omit<User, 'passwordHash'>) {
    return this.generateTokens(user);
  }

  /**
   * Validates the provided refresh token and generates new tokens.
   *
   * @param refreshToken - The refresh token provided by the client
   * @returns An object containing new access_token and refresh_token
   * @throws HttpException if the token is expired, invalid, or the user is not found
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = await new JwtService({
        secret: this.configService.get('jwt.refreshSecret'),
      }).verifyAsync(refreshToken);

      const user = await this.userRepository.findOne({
        where: { subjectId: payload.sub },
      });

      if (!user) {
        throw new HttpException(
          'Usuário não identificado, faça o login novamente',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return this.generateTokens(user);
    } catch (error) {
      switch (error?.message) {
        case 'jwt expired':
          throw new HttpException(
            'Token expirado, faça o login novamente',
            HttpStatus.UNAUTHORIZED,
          );
          break;

        default:
          throw new HttpException(error?.message, HttpStatus.UNAUTHORIZED);
          break;
      }
    }
  }
}
