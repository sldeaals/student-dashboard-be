import { Body, Controller, Get, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async createProfile(
    @CurrentUser('sub') userId: string,
    @Body() body: { firstName: string; lastName: string },
  ) {
    return this.studentsService.createStudentProfile(
      userId,
      body.firstName,
      body.lastName,
    );
  }

  @Get('me')
  async getMyProfile(@CurrentUser('sub') userId: string) {
    return this.studentsService.findByUserId(userId);
  }
}
