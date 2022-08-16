const User = require('../models/user');
const { CodeSuccess, CodeError } = require('../constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CodeSuccess.CREATED).send(user))
    .catch((err) => res.status(CodeError.SERVER_ERROR).send({ message: err.message }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(CodeSuccess.OK).send(users))
    .catch((err) => res.status(CodeError.SERVER_ERROR).send({ message: err.message })); // 500
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(CodeError.NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(CodeSuccess.OK).send(user);
    })
    .catch((err) => res.status(CodeError.SERVER_ERROR).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        res.status(CodeError.NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(CodeSuccess.OK).send(user);
    })
    .catch((err) => res.status(CodeError.SERVER_ERROR).send({ message: err.message }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        res.status(CodeError.NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(CodeSuccess.OK).send(user);
    })
    .catch((err) => res.status(CodeError.SERVER_ERROR).send({ message: err.message }));
};

// me
// module.exports.getUser = (req, res) => {
//   const { userId } = req.body;

//   User.findById(userId)
//     .then((user) => res.send(res.body))
//     .catch(handleErrors);
// }
