import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { verify, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokenRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}
  async execute(token: string): Promise<string> {
    const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload;

    const user_id = sub;

    const userTokens = await this.usersTokenRepository.findByUserIdAndRefreshToken(
      user_id,
      token
    );

    if (!userTokens) {
      throw new AppError('Refresh token does not exist');
    }

    await this.usersTokenRepository.deleteById(userTokens.id);

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.expires_id_refresh_token,
    });

    const expires_date = this.dateProvider.addDays(
      auth.expires_refresh_token_days
    );

    await this.usersTokenRepository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    return refresh_token;
  }
}
