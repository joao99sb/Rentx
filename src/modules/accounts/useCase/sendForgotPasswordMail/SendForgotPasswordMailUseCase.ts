import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvicer: IDateProvider,

    @inject('EtherealMailProvider')
    private mailProvider: IMailProvider
  ) {}
  async execute(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('user does not exists!');
    if (!user.id) throw new AppError('user.id does not exists!');

    const token = uuidV4();

    const expiresDate = this.dateProvicer.addHours(3);

    await this.usersTokensRepository.create({
      refresh_token: token,
      expires_date: expiresDate,
      user_id: user.id,
    });

    await this.mailProvider.sendMail(
      email,
      'recuperação de senha',
      `o link para o reset é ${token}`
    );
  }
}
