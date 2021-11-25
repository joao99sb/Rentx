import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { CreateUserController } from '@modules/accounts/useCase/createUser/CreateUserController';
import { ProfileUserContoller } from '@modules/accounts/useCase/profileUserUseCase/ProfileUserContoller';
import { UpdateUserAvatarController } from '@modules/accounts/useCase/updateUserAvatar/UpdateUserAvatarController';

import { ensureAuthenticated } from '../middleware/ensureAuthenticated';

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const updateAvatarController = new UpdateUserAvatarController();
const profileUserContoller = new ProfileUserContoller();

usersRoutes.post('/', createUserController.handle);
usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  updateAvatarController.handle
);
usersRoutes.get('/profile', ensureAuthenticated, profileUserContoller.handle);
export { usersRoutes };
