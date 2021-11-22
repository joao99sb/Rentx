import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteCarImagesUseCase } from './DeleteCarImagesUseCase';

export class DeleteCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { images_ids } = request.body;
    const { id } = request.params;

    const deleteCarImagesUseCase = container.resolve(DeleteCarImagesUseCase);

    await deleteCarImagesUseCase.execute({ carId: id, imagesIds: images_ids });

    return response.status(200).send();
  }
}
