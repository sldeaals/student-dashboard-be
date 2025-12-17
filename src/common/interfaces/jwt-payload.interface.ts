import { Role } from '../constants/roles.constant';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
}
