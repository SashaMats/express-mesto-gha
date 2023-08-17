const Card = require('../models/card');

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } res.status(500).send({ message: 'На сервере произошла ошика' });
    });
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      res.status(500).send({ message: `${err} На сервере произошла ошика` });
    });
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Карточка не найдена' });
        } else res.status(200).send({ message: 'Карточка удалена' });
      })
      .catch(() => {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      });
  } else { res.status(400).send({ message: 'Некоректно задан _id карточки' }); }
};

module.exports.addLike = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        } else res.send(card);
      })
      .catch(() => {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      });
  } else { res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' }); }
};

module.exports.deleteLike = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        } else res.send(card);
      })
      .catch(() => {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      });
  } else { res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' }); }
};
