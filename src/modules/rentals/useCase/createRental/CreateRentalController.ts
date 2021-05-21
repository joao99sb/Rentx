import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRentalUseCase } from './CreateRentalUseCase';

export class CreateRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { expected_return_date, car_id } = request.body;
    const { id } = request.user;

    const createRentalUsecase = container.resolve(CreateRentalUseCase);

    const rental = await createRentalUsecase.execute({
      expected_return_date,
      car_id,
      user_id: id,
    });

    return response.status(201).json(rental);
  }
}
