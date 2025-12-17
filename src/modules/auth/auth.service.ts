import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  getBCryptHashSalt,
  getJwtRefreshOptions,
} from '../../common/jwt.helpers';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ROLES } from '../../common/constants/roles.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, name: string, password: string) {
    const exists = await this.userModel.findOne({ email }).lean();
    if (exists) {
      throw new UnauthorizedException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, getBCryptHashSalt());

    const user = await this.userModel.create({
      email,
      name,
      passwordHash,
      roles: [ROLES.STUDENT],
      isActive: true,
    });

    return this.signTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signTokens(user);
  }

  /**
   * Refresh token is hashed & stored
   */
  private async signTokens(user: UserDocument) {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      roles: user.roles,
      version: user.refreshTokenVersion,
    };

    const accessToken = this.jwt.sign(payload);

    const refreshToken = this.jwt.sign(
      {
        sub: payload.sub,
        version: payload.version,
      },
      getJwtRefreshOptions(),
    );

    const refreshTokenHash = await bcrypt.hash(
      refreshToken,
      getBCryptHashSalt(),
    );

    await this.userModel.updateOne({ _id: user._id }, { refreshTokenHash });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }

  /**
   * Refresh token rotation
   */
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userModel.findById(userId);

    if (!user || !user.isActive || !user.refreshTokenHash) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return this.signTokens(user);
  }

  /**
   * Legacy endpoint compatibility
   */
  async verifyRefresh(refreshToken: string) {
    let payload: { sub: string; version: number };

    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET!,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userModel.findById(payload.sub);

    if (!user || !user.isActive || !user.refreshTokenHash) {
      throw new UnauthorizedException();
    }

    if (user.refreshTokenVersion !== payload.version) {
      await this.userModel.updateOne(
        { _id: user._id },
        {
          refreshTokenHash: null,
          $inc: { refreshTokenVersion: 1 },
        },
      );

      throw new UnauthorizedException('Refresh token reuse detected');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (!isValid) {
      await this.userModel.updateOne(
        { _id: user._id },
        {
          refreshTokenHash: null,
          $inc: { refreshTokenVersion: 1 },
        },
      );

      throw new UnauthorizedException('Refresh token reuse detected');
    }

    await this.userModel.updateOne(
      { _id: user._id },
      { $inc: { refreshTokenVersion: 1 } },
    );

    const updatedUser = await this.userModel.findById(user._id);
    if (!updatedUser) {
      throw new UnauthorizedException();
    }

    return this.signTokens(updatedUser);
  }
}
