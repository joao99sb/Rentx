import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    // verificar se o usuario existe
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('email or password incorrect');
    }
    // verificar se a senha está correta
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('email or password incorrect');
    }

    // gerar um jwt
    const token = sign({}, '5c12500b53d69102809990ff29b39335', {
      subject: user.id,
      expiresIn: '1d',
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        email: user.email,
        name: user.name,
      },
    };

    return tokenReturn;
  }
}
