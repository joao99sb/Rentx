import { NextFunction, Request, Response } from 'express';

import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepositoryt';
import { AppError } from '@shared/errors/AppError';

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { id } = request.user;
  const userRepository = new UsersRepository();
  const user = await userRepository.findById(id);

  if (user) {
    if (!user.isAdmin) {
      throw new AppError('User is not Admin');
    }
  }
  return next();
}
