import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async createStudentProfile(
    userId: string,
    firstName: string,
    lastName: string,
  ): Promise<Student> {
    const exists = await this.studentModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (exists) {
      throw new ConflictException('Student profile already exists');
    }

    return this.studentModel.create({
      userId,
      firstName,
      lastName,
    });
  }

  async findByUserId(userId: string): Promise<Student | null> {
    return this.studentModel.findOne({
      userId: new Types.ObjectId(userId),
      deletedAt: null,
    });
  }
}
