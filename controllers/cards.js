/* eslint-disable consistent-return */
const Card = require('../models/card');

const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_INTERNAL_SERVER_ERROR = 500;
const RESPONCE_SUCCESSFUL = 200;

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошика' });
    });
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((card) => {
      res.send(card);
    })
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошика' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } res.status(RESPONCE_SUCCESSFUL).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена' });
      } res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошика' });
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки' });
      } res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошика' });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки' });
      } res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошика' });
    });
};
