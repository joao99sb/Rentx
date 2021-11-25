import { instanceToInstance } from 'class-transformer';

import { IUserResponseDTO } from '../DTOs/IUserResponseDTO';
import { User } from '../infra/typeorm/entities/User';

export class UserMap {
  static toDTO({
    email,
    name,
    id,
    avatar,
    driverLicense,
    avatarUrl,
  }: User): IUserResponseDTO {
    const user = instanceToInstance({
      email,
      name,
      id,
      avatar,
      driverLicense,
      avatarUrl,
    });
    return user;
  }
}
