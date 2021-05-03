import { Router } from 'express';
import multer from 'multer';

import { CreateUserController } from '../../../../modules/accounts/useCase/createUser/CreateUserController';
import { UpdateUserAvatarController } from '../../../../modules/accounts/useCase/updateUserAvatar/UpdateUserAvatarController';

import uploadConfig from '../../../../config/upload';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig.upload('./tmp/avatar'));

const createUserController = new CreateUserController();
const updateAvatarController = new UpdateUserAvatarController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  updateAvatarController.hendle,
);

export { usersRoutes };