import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StudentAssignmentsService } from './student-assignments.service';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { ReviewAssignmentDto } from './dto/review-assignment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ROLES } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('student-assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentAssignmentsController {
  constructor(
    private readonly studentAssignmentsService: StudentAssignmentsService,
  ) {}

  @Post(':assignmentId/submit')
  @Roles(ROLES.STUDENT)
  submit(
    @Param('assignmentId') assignmentId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: SubmitAssignmentDto,
  ) {
    return this.studentAssignmentsService.submitAssignment(
      userId,
      assignmentId,
      dto.submission,
    );
  }

  @Patch(':id/review')
  @Roles(ROLES.TEACHER, ROLES.ADMIN)
  review(
    @Param('id') studentAssignmentId: string,
    @Body() dto: ReviewAssignmentDto,
  ) {
    return this.studentAssignmentsService.reviewAssignment(
      studentAssignmentId,
      dto.earnedPoints,
      dto.feedback,
    );
  }
}
