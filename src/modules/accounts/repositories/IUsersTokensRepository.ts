import { ICreateUserTokenDTO } from '../DTOs/ICreateUserTokenDTO';
import { UserTokens } from '../infra/typeorm/entities/UserToken';

export interface IUsersTokensRepository {
  create({
    refreshToken,
    expiresDate,
    userId,
  }: ICreateUserTokenDTO): Promise<UserTokens>;
  findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserTokens>;
  deleteById(id: string): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<UserTokens>;
}
