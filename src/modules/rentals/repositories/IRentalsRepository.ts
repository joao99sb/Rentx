import { ICreateRentalDTO } from '../DTOs/ICreateRentalDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

export interface IRentalsRepository {
  findOpenRentalByCar(car_id: string): Promise<Rental | undefined>;
  findOpenRentalByUser(user_id: string): Promise<Rental | undefined>;
  create(data: ICreateRentalDTO): Promise<Rental>;
}
