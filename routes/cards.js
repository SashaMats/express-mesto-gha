const card = require('express').Router();
const {
  addLike,
  deleteLike,
  deleteCard,
  getCard,
  addCard,
} = require('../controllers/cards');

card.put('/cards/:cardId/likes', addLike);
card.delete('/cards/:cardId/likes', deleteLike);
card.get('/cards', getCard);
card.delete('/cards/:cardId', deleteCard);
card.post('/cards', addCard);

module.exports = card;
