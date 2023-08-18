const User = require('../models/user');

module.exports.createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else res.status(500).send({ message: 'На сервере произошла ошика' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: `${err} На сервере произошла ошика` });
    });
};

module.exports.getUsersById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошика' });
    });
};

module.exports.refreshUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        } else {
          res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.refreshUser = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        } else {
          res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
