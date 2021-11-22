import { ICreateRentalDTO } from '@modules/rentals/DTOs/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

import { IRentalsRepository } from '../IRentalsRepository';

export class RentalsRepositoryInMemory implements IRentalsRepository {
  async findByUser(userId: string): Promise<Rental[]> {
    return this.rentals.filter(rental => rental.userId === userId);
  }
  async findById(id: string): Promise<Rental> {
    return this.rentals.find(rental => rental.id === id);
  }
  rentals: Rental[] = [];

  async findOpenRentalByCar(carId: string): Promise<Rental> {
    return this.rentals.find(
      rental => rental.carId === carId && !rental.endDate
    );
  }
  async findOpenRentalByUser(userId: string): Promise<Rental> {
    return this.rentals.find(
      rental => rental.userId === userId && !rental.endDate
    );
  }
  async create({
    carId,
    expectedReturnDate,
    userId,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      carId,
      expectedReturnDate,
      userId,
      startDate: new Date(),
    });
    this.rentals.push(rental);
    return rental;
  }
}
