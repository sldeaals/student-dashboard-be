import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role, ROLES } from '../../../common/constants/roles.constant';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    type: [String],
    enum: Object.values(ROLES),
    default: [ROLES.STUDENT],
  })
  roles: Role[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  refreshTokenHash?: string;

  @Prop({ default: 0 })
  refreshTokenVersion: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
