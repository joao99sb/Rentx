import { CategoriesRepositoryInMamory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMamory: CategoriesRepositoryInMamory;

describe('Create a category', () => {
  beforeEach(() => {
    categoriesRepositoryInMamory = new CategoriesRepositoryInMamory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMamory
    );
  });

  it('should be able to create a new category', async () => {
    const category = {
      name: 'category test',
      description: 'category description test',
    };

    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description,
    });

    const categoryCreated = await categoriesRepositoryInMamory.findByName(
      category.name
    );

    expect(categoryCreated).toHaveProperty('id');
  });

  it('should not be able to create a new category with name exists', async () => {
    const category = {
      name: 'category test',
      description: 'category description test',
    };

    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description,
    });
    await expect(
      createCategoryUseCase.execute({
        name: category.name,
        description: category.description,
      })
    ).rejects.toEqual(new AppError('Category already exixsts!'));
  });
});
