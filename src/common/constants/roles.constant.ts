export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  POWERUSER: 'poweruser',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
