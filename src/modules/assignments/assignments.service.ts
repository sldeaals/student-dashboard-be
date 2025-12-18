import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Assignment, AssignmentDocument } from './schemas/assignment.schema';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(Assignment.name)
    private readonly assignmentModel: Model<AssignmentDocument>,
  ) {}

  async create(dto: CreateAssignmentDto): Promise<Assignment> {
    return this.assignmentModel.create({
      ...dto,
      courseId: new Types.ObjectId(dto.courseId),
    });
  }

  async findByCourse(courseId: string): Promise<Assignment[]> {
    return this.assignmentModel
      .find({
        courseId: new Types.ObjectId(courseId),
        deletedAt: null,
      })
      .sort({ order: 1 })
      .lean();
  }

  async findOne(id: string): Promise<Assignment> {
    const assignment = await this.assignmentModel
      .findOne({ _id: id, deletedAt: null })
      .lean();

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async update(
    id: string,
    dto: Partial<CreateAssignmentDto>,
  ): Promise<Assignment> {
    const assignment = await this.assignmentModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      dto,
      { new: true },
    );

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.assignmentModel.updateOne(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Assignment not found');
    }
  }
}
