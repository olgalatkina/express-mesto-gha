const Card = require('../models/cards');
const { CodeSuccess, CodeError } = require('../constants');

const handleErrors = (err) => res.status(CodeError.SERVER_ERROR).send({ message: err.message });

module.exports.createCard = (req, res) => {
  console.log('createCard user._id: ', req.user._id);
  const { name, link } = req.body;

  Card.create({name, link, owner: req.user._id})
    .then(card => res.status(CodeSuccess.CREATED).send({data: card}))
    .catch(handleErrors)
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(handleErrors)
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(cards => res.send({data: cards}))
    .catch(handleErrors)
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
