import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';
import { getRepository, Repository } from 'typeorm';

import { CarImage } from '../entities/CarImage';

export class CarsImagesRepository implements ICarsImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const carImage = this.repository.create({
      car_id,
      image_name,
    });

    await this.repository.save(carImage);

    return carImage;
  }

  async findByIds(ids: string[]): Promise<CarImage[]> {
    const carImageRow = await this.repository.findByIds(ids);

    return carImageRow;
  }

  async removeImage(ids: string[]): Promise<void> {
    const carImageRow = await this.findByIds(ids);

    await this.repository.remove(carImageRow);
  }
}
