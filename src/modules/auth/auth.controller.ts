import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { I18nService } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body()
    requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return await this.authService
      .requestPasswordReset(requestPasswordResetDto)
      .then(() => ({
        message: this.i18n.translate(
          'common.modules.auth.requestPasswordNotice',
        ),
      }));
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto).then(() => ({
      message: this.i18n.translate('common.modules.auth.resetPasswordSuccess'),
    }));
  }
}
