import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('list cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  });

  it('shloud be able to list all available cars', async () => {

    const car = await carsRepositoryInMemory.create({
      brand:"Car_brand",
      name:"Car 1",
      category_id:"categoryID",
      daily_rate:110.00,
      description:"Car description",
      fine_amount:40,
      license_plate:"ABC-1234"
    })

    

    const cars = await listAvailableCarsUseCase.execute({});
    
    expect(cars).toEqual([car])
  });

  it("should be able to list all avalible cars by brand",async()=>{
    const car = await carsRepositoryInMemory.create({
      brand:"Car_brand_test",
      name:"Car 2",
      category_id:"categoryID",
      daily_rate:110.00,
      description:"Car description",
      fine_amount:40,
      license_plate:"ABC-1235"
    })

    

    const cars = await listAvailableCarsUseCase.execute({
      brand:"Car_brand_test"
    });
    
    expect(cars).toEqual([car])
  })

  it("should be able to list all avalible cars by name",async()=>{
    const car = await carsRepositoryInMemory.create({
      brand:"Car_brand",
      name:"Car 3",
      category_id:"categoryID",
      daily_rate:110.00,
      description:"Car description",
      fine_amount:40,
      license_plate:"ABC-1236"
    })

    

    const cars = await listAvailableCarsUseCase.execute({
      name:"Car 3"
    });
    
    expect(cars).toEqual([car])
  })

  it("should be able to list all avalible cars by category",async()=>{
    const car = await carsRepositoryInMemory.create({
      brand:"Car_brand",
      name:"Car 4",
      category_id:"12345",
      daily_rate:110.00,
      description:"Car description",
      fine_amount:40,
      license_plate:"ABC-1234"
    })

    

    const cars = await listAvailableCarsUseCase.execute({
      category_id:"12345"
    });
    
    expect(cars).toEqual([car])
  })
});
