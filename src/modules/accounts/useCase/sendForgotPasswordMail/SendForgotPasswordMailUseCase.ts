import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
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

    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}
  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgotPassword.hbs'
    );

    if (!user) throw new AppError('User does not exists!');

    const token = uuidV4();

    const expiresDate = this.dateProvicer.addHours(3);

    await this.usersTokensRepository.create({
      refreshToken: token,
      expiresDate,
      userId: user.id,
    });
    const variables = {
      name: user.name,
      link: `${process.env.PROTOCOL}://${process.env.API_URL}/password/reset?token=${token}`,
    };

    await this.mailProvider.sendMail(
      email,
      'recuperação de senha',
      variables,
      templatePath
    );
  }
}
