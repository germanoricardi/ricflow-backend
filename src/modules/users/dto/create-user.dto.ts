import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto extends UserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
