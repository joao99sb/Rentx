import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
describe('create car specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });
  it('should not be able to add a new specification to a nonexistent car', async () => {
    const carId = '1234';
    const specificationsId = ['5432'];
    await expect(
      createCarSpecificationUseCase.execute({
        carId,
        specificationsId,
      })
    ).rejects.toEqual(new AppError('car does not exist'));
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'name car',
      description: 'description car',
      dailyRate: 100,
      fineAmount: 60,
      brand: 'Brand',
      categoryId: 'Category',
      licensePlate: 'ABC-1234',
    });

    const specification = await specificationsRepositoryInMemory.create({
      description: 'test',
      name: 'test',
    });
    const specificationsId = [specification.id];

    const specificationsCar = await createCarSpecificationUseCase.execute({
      carId: car.id,
      specificationsId,
    });

    expect(specificationsCar).toHaveProperty('specifications');
    expect(specificationsCar.specifications.length).toBe(1);
  });
});
