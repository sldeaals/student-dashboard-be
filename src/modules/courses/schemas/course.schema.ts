import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CourseStatus } from '../courses.constants';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, index: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  topics: string[];

  @Prop({ enum: CourseStatus, default: CourseStatus.PENDING })
  status: CourseStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], default: [] })
  prerequisites: Types.ObjectId[];

  @Prop({ required: true })
  minimumGrade: number;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
