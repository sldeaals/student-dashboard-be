import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
} from 'class-validator';
import { Role } from '../../../common/constants/roles.constant';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsArray()
  roles?: Role[];
}
