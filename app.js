const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const ERROR_BAD_REQUEST = 400;

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { _id: '64da8a77c6cbf1d7a1eea376' };
  next();
});

app.use(cardRouter);
app.use(userRouter);

app.use('*', (req, res) => {
  res.status(ERROR_BAD_REQUEST).send({ message: 'Такой страницы нет' });
});

app.listen(PORT);
