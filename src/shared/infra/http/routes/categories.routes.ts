import { Router } from 'express';
import multer from 'multer';

import { CreateCategotyController } from '@modules/cars/useCase/createCategory/CreateCategoryController';
import { ImportCategoryController } from '@modules/cars/useCase/importCategory/ImportCategoryController';
import { ListCategoriesController } from '@modules/cars/useCase/listCategory/ListCategoriesController';
import { ensureAdmin } from '@shared/infra/http/middleware/ensureAdmin';
import { ensureAuthenticated } from '@shared/infra/http/middleware/ensureAuthenticated';

const categoriesRoutes = Router();

const upload = multer({
  dest: './tmp',
});

const createCategotyController = new CreateCategotyController();
const importCategoryController = new ImportCategoryController();
const listCategoriesController = new ListCategoriesController();

categoriesRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCategotyController.handle
);

categoriesRoutes.get('/', listCategoriesController.handle);

categoriesRoutes.post(
  '/imports',
  ensureAuthenticated,
  ensureAdmin,
  upload.single('file'),
  importCategoryController.handle
);

export { categoriesRoutes };
