export enum AssignmentType {
  TASK = 'task',
  QUIZ = 'quiz',
  EXAM = 'exam',
  OPTIONAL = 'optional',
}

export const ASSIGNMENT_TYPES = {
  TASK: 'task',
  QUIZ: 'quiz',
  EXAM: 'exam',
  OPTIONAL: 'optional',
} as const;

export type AssignmentTypes =
  (typeof ASSIGNMENT_TYPES)[keyof typeof ASSIGNMENT_TYPES];

export enum AssignmentStatus {
  NOT_STARTED = 'not_started',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
