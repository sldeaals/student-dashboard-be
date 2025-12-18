import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AssignmentType } from '../assignments.constant';

export class CreateAssignmentDto {
  @IsMongoId()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(AssignmentType)
  type: AssignmentType;

  @IsNumber()
  @Min(1)
  order: number;

  @IsNumber()
  @Min(0)
  points: number;

  @IsOptional()
  dueDate?: Date;
}
