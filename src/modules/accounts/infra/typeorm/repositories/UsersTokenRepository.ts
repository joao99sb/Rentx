import { ICreateUserTokenDTO } from '@modules/accounts/DTOs/ICreateUserTokenDTO';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { getRepository, Repository } from 'typeorm';

import { UserTokens } from '../entities/UserToken';

export class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }
  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens | undefined> {
    const userTokens = await this.repository.findOne({
      user_id,
      refresh_token,
    });

    return userTokens;
  }

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      refresh_token,
      expires_date,
      user_id,
    });

    await this.repository.save(userToken);

    return userToken;
  }
}
