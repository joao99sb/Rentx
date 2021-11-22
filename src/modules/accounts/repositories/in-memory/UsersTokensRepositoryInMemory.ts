import { ICreateUserTokenDTO } from '@modules/accounts/DTOs/ICreateUserTokenDTO';
import { UserTokens } from '@modules/accounts/infra/typeorm/entities/UserToken';

import { IUsersTokensRepository } from '../IUsersTokensRepository';

export class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  private usersTokens: UserTokens[] = [];

  async create({
    expiresDate,
    userId,
    refreshToken,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      expiresDate,
      userId,
      refreshToken,
    });
    this.usersTokens.push(userToken);
    return userToken;
  }

  async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserTokens> {
    return this.usersTokens.find(
      userToken =>
        userToken.userId === userId && userToken.refreshToken === refreshToken
    );
  }

  async findByRefreshToken(token: string): Promise<UserTokens> {
    return this.usersTokens.find(userToken => userToken.refreshToken === token);
  }

  async deleteById(id: string): Promise<void> {
    const userTokenIndex = this.usersTokens.findIndex(
      userToken => userToken.id === id
    );
    this.usersTokens.splice(userTokenIndex, 1);
  }
}
