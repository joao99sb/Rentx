import { verify, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refreshToken: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokenRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}
  async execute(token: string): Promise<ITokenResponse> {
    const { email, sub } = verify(token, auth.secretRefreshToken) as IPayload;

    const userId = sub;

    const userTokens = await this.usersTokenRepository.findByUserIdAndRefreshToken(
      userId,
      token
    );

    if (!userTokens) {
      throw new AppError('Refresh token does not exist');
    }

    await this.usersTokenRepository.deleteById(userTokens.id);
    const refreshToken = sign({ email }, auth.secretRefreshToken, {
      subject: userId,
      expiresIn: auth.expiresIdRefreshToken,
    });

    const expiresDate = this.dateProvider.addDays(auth.expiresRefreshTokenDays);

    await this.usersTokenRepository.create({
      expiresDate,
      refreshToken,
      userId,
    });

    const newToken = sign({}, auth.secretToken, {
      subject: userId,
      expiresIn: auth.expiresInToken,
    });

    return { refreshToken, token: newToken };
  }
}
