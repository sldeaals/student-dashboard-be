import { JwtSignOptions } from '@nestjs/jwt';

/**
 * Returns JWT refresh options with proper type conversion.
 * Converts env string to number if numeric, otherwise defaults to 7 days.
 */
export function getJwtRefreshOptions(): JwtSignOptions {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN
    ? Number(process.env.JWT_REFRESH_EXPIRES_IN)
    : 604_800;

  return {
    secret,
    expiresIn,
  };
}

export function getBCryptHashSalt(): number {
  return process.env.BCRYPT_HASH_SALT
    ? Number(process.env.BCRYPT_HASH_SALT)
    : 12;
}
