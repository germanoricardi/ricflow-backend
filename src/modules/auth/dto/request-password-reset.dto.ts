import { PickType } from '@nestjs/mapped-types';
import { UserDto } from 'src/modules/users/dto/user.dto';

export class RequestPasswordResetDto extends PickType(UserDto, ['email']) {}
