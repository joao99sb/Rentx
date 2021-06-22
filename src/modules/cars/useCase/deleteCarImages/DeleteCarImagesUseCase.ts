import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { deleteFile } from '@utils/file';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

interface IRequest {
  car_id: string;
  images_ids: string[];
}

@injectable()
export class DeleteCarImagesUseCase {
  constructor(
    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,

    @inject('CarsRepository')
    private carsReposritory: ICarsRepository
  ) {}

  async execute({ car_id, images_ids }: IRequest): Promise<void> {
    const carExist = await this.carsReposritory.findById(car_id);
    const carImages = await this.carsImagesRepository.findByIds(images_ids);

    if (carImages.length < images_ids.length) {
      throw new AppError('error in some image search');
    }

    if (!carExist) {
      throw new AppError('car do not exist');
    }
    carImages.forEach(async image => {
      if (image.car_id !== car_id) {
        throw new AppError('this image do not belong to this car');
      }

      await deleteFile(`./tmp/cars/${image.image_name}`);
    });

    await this.carsImagesRepository.removeImage(images_ids);
  }
}
