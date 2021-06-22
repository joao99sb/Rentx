import auth from '@config/auth';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
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
  refresh_token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);
    const {
      expires_in_token,
      secret_token,
      secret_refresh_token,
      expires_id_refresh_token,
      expires_refresh_token_days,
    } = auth;
    if (!user) {
      throw new AppError('email or password incorrect');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('email or password incorrect');
    }

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token,
    });
    if (!user.id) {
      throw new AppError('user id not exist');
    }

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: user.id,
      expiresIn: expires_id_refresh_token,
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      expires_date: refresh_token_expires_date,
      refresh_token,
      user_id: user.id,
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        email: user.email,
        name: user.name,
      },
      refresh_token,
    };

    return tokenReturn;
  }
}
