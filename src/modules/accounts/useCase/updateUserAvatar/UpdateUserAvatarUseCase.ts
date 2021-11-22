import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { deleteFile } from '@utils/file';

interface IRequest {
  userId: string;
  avatarFile: string;
}

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ avatarFile, userId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (user) {
      if (user.avatar) {
        await deleteFile(`./tmp/avatar/${user.avatar}`);
      }
      user.avatar = avatarFile;
      await this.usersRepository.create(user);
    }
  }
}
