import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserDto } from 'src/modules/users/dto/user.dto';

export class LoginDto extends PickType(UserDto, ['userName']) {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
