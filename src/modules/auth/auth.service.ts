import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
  async refreshToken(refreshToken: RefreshTokenDto['refresh_token']) {
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

  /**
   * Handles password reset requests by generating a reset token and sending an email with the reset link.
   *
   * @param email - The email address of the user requesting the password reset.
   * @throws HttpException - If the user is not found in the database.
   */
  async requestPasswordReset(
    email: RequestPasswordResetDto['email'],
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const token = crypto.randomUUID();
    const expiration = new Date();
    expiration.setHours(
      expiration.getHours() +
        this.configService.get('passwordReset.expirationHour'),
    );

    user.passwordResetToken = token;
    user.passwordResetExpires = expiration;
    await this.userRepository.save(user);

    const resetUrl = `${this.configService.get('passwordReset.url')}?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: this.configService.get('email.host'),
      port: this.configService.get('email.port'),
      secure: this.configService.get('email.secure'),
      auth: {
        user: this.configService.get('email.auth.user'),
        pass: this.configService.get('email.auth.pass'),
      },
    });

    await transporter.sendMail({
      from: this.configService.get('email.from'),
      to: user.email,
      subject: 'Recuperação de Senha',
      text: `Você solicitou uma nova senha. Clique no link para redefinir: ${resetUrl}`,
      html: `<p>Você solicitou uma nova senha.</p><p><a href="${resetUrl}">Clique aqui para redefinir</a></p>`,
    });
  }

  /**
   * Resets the user's password using a valid token and a new password.
   *
   * @param password - The new password to set.
   * @param token - The token received by email to authorize the password reset.
   * @throws HttpException - If the token is invalid or has expired.
   */
  async resetPassword(
    password: ResetPasswordDto['password'],
    token: ResetPasswordDto['token'],
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new HttpException(
        'Token inválido ou expirado',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.passwordResetToken = null as unknown as undefined;
    user.passwordResetExpires = null as unknown as undefined;

    await this.userRepository.save(user);
  }
}
