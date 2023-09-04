/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
// const jwt = require('jsonwebtoken');
const Card = require('../models/card');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

// const ERROR_BAD_REQUEST = 400;
// const ERROR_NOT_FOUND = 404;
// const ERROR_INTERNAL_SERVER_ERROR = 500;
const RESPONCE_SUCCESSFUL = 200;
const RESPONCE_CREATED = 201;

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(RESPONCE_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else { next(err); }
    });
};

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw (new NotFoundError('Карточка не найдена'));
      } if (req.user._id !== card.owner.toString()) {
        throw (new ForbiddenError('У вас нет прав для совершения этого действия'));
      } Card.deleteOne(card)
        .then(() => res.status(RESPONCE_SUCCESSFUL).send({ message: 'Карта удалена' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else { next(err); }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw (new NotFoundError('Карточка не найдена'));
      } if (req.user._id === card.owner.toString()) {
        return Card.deleteOne(card)
          .then(() => res.status(RESPONCE_SUCCESSFUL).send({ message: 'Карта удалена' }))
          .catch(next);
      } next(new ForbiddenError('У вас нет прав для совершения этого действия'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Карточка с указанным _id не найдена'));
      } else { next(err); }
    });
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные для постановки/снятии лайка');
      } res.status(RESPONCE_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий _id карточки'));
      } else { next(err); }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные для постановки/снятии лайка');
      } else res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий _id карточки'));
      } else { next(err); }
    });
};
