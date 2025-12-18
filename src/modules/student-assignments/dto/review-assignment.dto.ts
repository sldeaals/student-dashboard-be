import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ReviewAssignmentDto {
  @IsInt()
  @Min(0)
  earnedPoints: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}
