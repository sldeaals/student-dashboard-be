export enum StudentAssignmentStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
  EXPIRED = 'expired',
}

export interface CourseGradeAggregate {
  total: number;
}
