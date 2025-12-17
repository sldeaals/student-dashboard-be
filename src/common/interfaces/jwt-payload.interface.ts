import { Role } from '../constants/roles.constant';

export interface JwtPayload {
  sub: string;
  version: number;
  email: string;
  roles: Role[];
}
