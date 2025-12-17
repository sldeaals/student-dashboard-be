import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET!,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.userModel.findById(payload.sub).lean();

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return {
      id: user._id.toString(),
      email: user.email,
      roles: user.roles,
    };
  }
}
