const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CodeSuccess, CodeError } = require('../constants');
const SALT_ROUNDS = 10;
const JWT_SECRET = 'some-secret-key'; // добавить в .env

module.exports.createUser = (req, res) => {
  const { name, about, avatar, password, email } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ name, about, avatar, password: hash, email }))
    .then((user) => res.status(CodeSuccess.CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CodeError.ALREADY_EXISTS).send({ message: 'Такой пользователь уже существует' });
      }
      if (err.name === 'ValidationError') {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(CodeSuccess.OK).send(users))
    .catch((err) => res.status(CodeError.SERVER_ERROR).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(CodeError.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.status(CodeSuccess.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(CodeError.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.status(CodeSuccess.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(CodeError.NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(CodeSuccess.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
       return res.status(CodeError.UNAUTHORIZED).send({ message: 'Неверный email или пароль' });
    });
};
