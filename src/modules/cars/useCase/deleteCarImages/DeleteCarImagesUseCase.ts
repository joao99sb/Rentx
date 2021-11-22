import { inject, injectable } from 'tsyringe';

import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { AppError } from '@shared/errors/AppError';
import { deleteFile } from '@utils/file';

interface IRequest {
  carId: string;
  imagesIds: string[];
}

@injectable()
export class DeleteCarImagesUseCase {
  constructor(
    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,

    @inject('CarsRepository')
    private carsReposritory: ICarsRepository
  ) {}

  async execute({ carId, imagesIds }: IRequest): Promise<void> {
    const carExist = await this.carsReposritory.findById(carId);
    const carImages = await this.carsImagesRepository.findByIds(imagesIds);

    if (carImages.length < imagesIds.length) {
      throw new AppError('error in some image search');
    }

    if (!carExist) {
      throw new AppError('car do not exist');
    }
    carImages.forEach(async image => {
      if (image.carId !== carId) {
        throw new AppError('this image do not belong to this car');
      }

      await deleteFile(`./tmp/cars/${image.imageName}`);
    });

    await this.carsImagesRepository.removeImage(imagesIds);
  }
}
