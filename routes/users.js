const usersRouter = require('express').Router();
const {
  createUser, getUsers, getUsersById, refreshUser, refreshUserAvatar,
} = require('../controllers/users');

usersRouter.post('/users', createUser);
usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUsersById);
usersRouter.patch('/users/me', refreshUser);
usersRouter.patch('/users/me/avatar', refreshUserAvatar);

module.exports = usersRouter;
