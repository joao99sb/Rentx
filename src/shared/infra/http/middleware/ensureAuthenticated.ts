import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepositoryt';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, '5c12500b53d69102809990ff29b39335');

    const { sub: user_id } = decoded as IPayload;

    const userRepository = new UsersRepository();
    const user = await userRepository.findById(user_id);

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
