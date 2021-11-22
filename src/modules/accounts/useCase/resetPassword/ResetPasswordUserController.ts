import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetPasswordUserUseCase } from './ResetPasswordUseruseCase';

export class ResetPasswordUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    const resetPasswordUserUseCase = container.resolve(
      ResetPasswordUserUseCase
    );

    await resetPasswordUserUseCase.execute({ token: String(token), password });

    return response.send();
  }
}
