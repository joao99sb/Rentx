import uploadConfig from '@config/upload';
import { CreateCarController } from '@modules/cars/useCase/createCar/CreateCarController';
import { CreateCarSpecificationController } from '@modules/cars/useCase/createCarSpecification/CreateCarSpecificationController';
import { DeleteCarImagesController } from '@modules/cars/useCase/deleteCarImages/DeleteCarImagesController';
import { ListAvailableCarsController } from '@modules/cars/useCase/listAvailableCars/ListAvailableCarsController';
import { UploadCarImagesController } from '@modules/cars/useCase/uploadCarImages/UploadCarImagesController';
import { Router } from 'express';
import multer from 'multer';

import { ensureAdmin } from '../middleware/ensureAdmin';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImagesController();
const deleteCarImagesController = new DeleteCarImagesController();

const uploadImages = multer(uploadConfig.upload('./tmp/cars'));

carsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
);

carsRoutes.get('/available', listAvailableCarsController.handle);

carsRoutes.post(
  '/specifications/:id',
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationController.handle
);

carsRoutes.post(
  '/images/:id',
  ensureAuthenticated,
  ensureAdmin,
  uploadImages.array('images'),
  uploadCarImagesController.handle
);

carsRoutes.delete(
  '/images/:id',
  ensureAuthenticated,
  ensureAdmin,
  deleteCarImagesController.handle
);

export { carsRoutes };
