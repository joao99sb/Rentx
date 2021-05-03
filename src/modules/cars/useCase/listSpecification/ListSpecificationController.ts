import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { SpecificationUseCase } from './ListSpecificationUseCase';

export class ListSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const specificationUseCase = container.resolve(SpecificationUseCase);

    const all = await specificationUseCase.execute();

    return response.status(200).json(all);
  }
}
