import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/DTOs/ICreateUserTokenDTO';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

import { UserTokens } from '../entities/UserToken';

export class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }
  async findByRefreshToken(refreshToken: string): Promise<UserTokens> {
    const userToken = await this.repository.findOne({
      refreshToken,
    });
    return userToken;
  }
  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
  async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserTokens> {
    const userTokens = await this.repository.findOne({
      userId,
      refreshToken,
    });

    return userTokens;
  }

  async create({
    expiresDate,
    refreshToken,
    userId,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      refreshToken,
      expiresDate,
      userId,
    });

    await this.repository.save(userToken);

    return userToken;
  }
}
