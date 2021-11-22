import { inject, injectable } from 'tsyringe';

import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';

interface IRequest {
  carId: string;
  imagesName: string[];
}

@injectable()
export class UploadCarImageUseCase {
  constructor(
    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository
  ) {}

  async execute({ carId, imagesName }: IRequest): Promise<void> {
    imagesName.map(async image => {
      await this.carsImagesRepository.create(carId, image);
    });
  }
}
