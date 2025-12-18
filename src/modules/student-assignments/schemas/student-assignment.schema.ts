import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StudentAssignmentStatus } from '../student-assignments.constant';

export type StudentAssignmentDocument = StudentAssignment & Document;

@Schema({ timestamps: true })
export class StudentAssignment {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Assignment',
    required: true,
    index: true,
  })
  assignmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true, index: true })
  courseId: Types.ObjectId;

  @Prop({
    enum: StudentAssignmentStatus,
    default: StudentAssignmentStatus.PENDING,
    index: true,
  })
  status: StudentAssignmentStatus;

  @Prop({ type: Object })
  submission?: Record<string, unknown>;

  @Prop()
  submittedAt?: Date;

  @Prop()
  reviewedAt?: Date;

  @Prop({ default: 0 })
  earnedPoints: number;

  @Prop()
  feedback?: string;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const StudentAssignmentSchema =
  SchemaFactory.createForClass(StudentAssignment);

StudentAssignmentSchema.index(
  { studentId: 1, assignmentId: 1 },
  { unique: true },
);
