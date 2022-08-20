const Card = require('../models/card');
const { CodeSuccess, CodeError } = require('../constants');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CodeSuccess.CREATED).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(CodeSuccess.OK).send(cards))
    .catch((err) => res.status(CodeError.SERVER_ERROR).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(CodeError.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.status(CodeSuccess.OK).send(card);
    })
    .catch((err) => {
      if (err) {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(CodeError.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.status(CodeSuccess.OK).send(card);
    })
    .catch((err) => {
      if (err) {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(CodeError.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.status(CodeSuccess.OK).send(card);
    })
    .catch((err) => {
      if (err) {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};
