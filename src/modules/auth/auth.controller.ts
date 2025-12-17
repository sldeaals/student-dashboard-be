import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';

class RegisterDto {
  @IsEmail() email: string;
  @IsString() name: string;
  @MinLength(8) password: string;
}

class LoginDto {
  @IsEmail() email: string;
  @MinLength(8) password: string;
}

class RefreshDto {
  @IsString() token: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Throttle({
    auth: {
      limit: 3,
      ttl: 60,
    },
  })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.name, dto.password);
  }

  @Throttle({
    auth: {
      limit: 5,
      ttl: 60,
    },
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.verifyRefresh(dto.token);
  }
}
