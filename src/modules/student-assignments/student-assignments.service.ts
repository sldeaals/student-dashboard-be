import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  StudentAssignment,
  StudentAssignmentDocument,
} from './schemas/student-assignment.schema';
import {
  Assignment,
  AssignmentDocument,
} from '../assignments/schemas/assignment.schema';
import {
  CourseGradeAggregate,
  StudentAssignmentStatus,
} from './student-assignments.constant';
import { Student, StudentDocument } from '../students/schemas/student.schema';

@Injectable()
export class StudentAssignmentsService {
  constructor(
    @InjectModel(StudentAssignment.name)
    private readonly studentAssignmentModel: Model<StudentAssignmentDocument>,

    @InjectModel(Assignment.name)
    private readonly assignmentModel: Model<AssignmentDocument>,

    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async submitAssignmentByUserId(
    userId: string,
    assignmentId: string,
    submission?: Record<string, unknown>,
  ) {
    const student = await this.studentModel.findOne({
      userId: new Types.ObjectId(userId),
      deletedAt: null,
    });

    if (!student) {
      throw new ForbiddenException('Student profile not found');
    }

    return this.submitAssignment(
      student._id.toString(),
      assignmentId,
      submission,
    );
  }

  async submitAssignment(
    studentId: string,
    assignmentId: string,
    submission?: Record<string, unknown>,
  ) {
    const assignment = await this.assignmentModel.findById(assignmentId);

    if (!assignment || assignment.deletedAt) {
      throw new NotFoundException('Assignment not found');
    }

    const record = await this.studentAssignmentModel.findOne({
      studentId,
      assignmentId,
    });

    if (!record) {
      throw new NotFoundException('Student assignment not initialized');
    }

    if (record.status !== StudentAssignmentStatus.PENDING) {
      throw new BadRequestException('Assignment already submitted');
    }

    record.submission = submission;
    record.submittedAt = new Date();
    record.status = StudentAssignmentStatus.SUBMITTED;

    await record.save();

    return record;
  }

  async reviewAssignment(
    studentAssignmentId: string,
    earnedPoints: number,
    feedback?: string,
  ) {
    const record =
      await this.studentAssignmentModel.findById(studentAssignmentId);

    if (!record) {
      throw new NotFoundException('Student assignment not found');
    }

    const assignment = await this.assignmentModel.findById(record.assignmentId);

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (earnedPoints > assignment.points) {
      throw new BadRequestException('Earned points exceed assignment maximum');
    }

    record.earnedPoints = earnedPoints;
    record.feedback = feedback;
    record.reviewedAt = new Date();
    record.status = StudentAssignmentStatus.REVIEWED;

    await record.save();

    return record;
  }

  async calculateCourseGrade(
    studentId: string,
    courseId: string,
  ): Promise<number> {
    const results =
      await this.studentAssignmentModel.aggregate<CourseGradeAggregate>([
        {
          $match: {
            studentId: new Types.ObjectId(studentId),
            courseId: new Types.ObjectId(courseId),
            status: StudentAssignmentStatus.REVIEWED,
            deletedAt: null,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$earnedPoints' },
          },
        },
      ]);

    return results.length > 0 ? results[0].total : 0;
  }
}
