import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { CreateUserController } from '@modules/accounts/useCase/createUser/CreateUserController';
import { UpdateUserAvatarController } from '@modules/accounts/useCase/updateUserAvatar/UpdateUserAvatarController';

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
  updateAvatarController.handle
);

export { usersRoutes };
