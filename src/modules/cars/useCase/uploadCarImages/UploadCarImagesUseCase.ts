import { inject, injectable } from 'tsyringe';

import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';

interface IRequest {
  carId: string;
  imagesName: string[];
}

@injectable()
export class UploadCarImageUseCase {
  constructor(
    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ carId, imagesName }: IRequest): Promise<void> {
    imagesName.map(async image => {
      await this.carsImagesRepository.create(carId, image);
      await this.storageProvider.save(image, 'car');
    });
  }
}
