import { CreateCarController } from '@modules/cars/useCase/createCar/CreateCarController';
import { ListAvailableCarsController } from '@modules/cars/useCase/listAvailableCars/ListAvailableCarsController';
import { Router } from 'express';
import { ensureAdmin } from '../middleware/ensureAdmin';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController()

carsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle,
);

carsRoutes.get("/available",listAvailableCarsController.hendle)

export { carsRoutes };
