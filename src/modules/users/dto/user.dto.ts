import { IsEmail, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsBoolean()
  isActive: boolean;
}
