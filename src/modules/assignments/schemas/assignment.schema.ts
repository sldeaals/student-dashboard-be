import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AssignmentType } from '../assignments.constant';

export type AssignmentDocument = Assignment & Document;

@Schema({ timestamps: true })
export class Assignment {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true, index: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: AssignmentType, required: true })
  type: AssignmentType;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  points: number;

  @Prop()
  dueDate?: Date;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
