import { IsObject, IsOptional } from 'class-validator';

export class SubmitAssignmentDto {
  /**
   * Submission payload (answers, files refs, text, etc)
   */
  @IsOptional()
  @IsObject()
  submission?: Record<string, unknown>;
}
