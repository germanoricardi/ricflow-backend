import { IsString, MinLength, IsOptional } from 'class-validator';
import { UserDto } from './user.dto';

export class UpdateUserDto extends UserDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
