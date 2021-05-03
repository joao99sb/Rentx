import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';
import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('create car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'name car',
      description: 'description car',
      daily_rate: 100,
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'Category',
      license_plate: 'ABC-1234',
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a car with a license plate repeated', () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: 'name car1',
        description: 'description car',
        daily_rate: 100,
        fine_amount: 60,
        brand: 'Brand',
        category_id: 'Category',
        license_plate: 'ABC-1234',
      });
      await createCarUseCase.execute({
        name: 'name car2',
        description: 'description car',
        daily_rate: 100,
        fine_amount: 60,
        brand: 'Brand',
        category_id: 'Category',
        license_plate: 'ABC-1234',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a car with avalible true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'car avalible',
      description: 'description car',
      daily_rate: 100,
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'Category',
      license_plate: 'ABC-1235',
    });

    expect(car.available).toBe(true);
  });
});
