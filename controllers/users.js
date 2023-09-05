/* eslint-disable camelcase */
/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_KEY = 'some-secret-key' } = process.env;

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ConflictError = require('../errors/conflictError');

// const ERROR_BAD_REQUEST = 400;
// const ERROR_NOT_FOUND = 404;
// const ERROR_INTERNAL_SERVER_ERROR = 500;
const RESPONCE_SUCCESSFUL = 200;
const RESPONCE_CREATED = 201;

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(RESPONCE_CREATED).send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такими данными уже зарегистрирован'));
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((user) => {
      res.status(RESPONCE_SUCCESSFUL).send(user);
    })
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(RESPONCE_SUCCESSFUL).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные _id'));
      } else { next(err); }
    });
};

module.exports.getUserMe = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(RESPONCE_SUCCESSFUL).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные _id'));
      } else { next(err); }
    });
};

module.exports.refreshUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else { next(err); }
    });
};

module.exports.refreshUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else { next(err); }
    });
};
