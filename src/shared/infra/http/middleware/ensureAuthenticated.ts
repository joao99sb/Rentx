import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import auth from '@config/auth';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepositoryt';
import { UsersTokensRepository } from '@modules/accounts/infra/typeorm/repositories/UsersTokenRepository';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;
  const usersTokensRepository = new UsersTokensRepository();
  if (!authHeader) {
    throw new AppError('token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(token, auth.secretRefreshToken) as IPayload;

    const user = await usersTokensRepository.findByUserIdAndRefreshToken(
      userId,
      token
    );

    if (!user) {
      throw new AppError('User does not exist', 401);
    }

    request.user = {
      id: user.id,
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid Token', 401);
  }
}
