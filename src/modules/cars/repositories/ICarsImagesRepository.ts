import { CarImage } from '../infra/typeorm/entities/CarImage';

export interface ICarsImagesRepository {
  create(carId: string, imageName: string): Promise<CarImage>;
  removeImage(ids: string[]): Promise<void>;
  findByIds(ids: string[]): Promise<CarImage[]>;
}
