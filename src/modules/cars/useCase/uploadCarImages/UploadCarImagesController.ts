import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadCarImageUseCase } from './UploadCarImagesUseCase';

interface IFile {
  filename: string;
}

export class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const images = request.files as IFile[];

    const uploadCarImageUseCase = container.resolve(UploadCarImageUseCase);

    const imagesName = images.map(file => file.filename);

    await uploadCarImageUseCase.execute({
      carId: id,
      imagesName,
    });

    return response.status(201).send();
  }
}
