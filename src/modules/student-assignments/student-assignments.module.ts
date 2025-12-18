import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentAssignmentsController } from './student-assignments.controller';
import { StudentAssignmentsService } from './student-assignments.service';
import {
  StudentAssignment,
  StudentAssignmentSchema,
} from './schemas/student-assignment.schema';
import {
  Assignment,
  AssignmentSchema,
} from '../assignments/schemas/assignment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentAssignment.name, schema: StudentAssignmentSchema },
      { name: Assignment.name, schema: AssignmentSchema },
    ]),
  ],
  controllers: [StudentAssignmentsController],
  providers: [StudentAssignmentsService],
  exports: [StudentAssignmentsService],
})
export class StudentAssignmentsModule {}
