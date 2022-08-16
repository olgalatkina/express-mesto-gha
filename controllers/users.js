const User = require('../models/user');
const { CodeSuccess, CodeError } = require('../constants');

const handleErrors = (err) => res.status(CodeError.SERVER_ERROR).send({ message: err.message });


module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CodeSuccess.CREATED).send(user))
    .catch(handleErrors);
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(handleErrors);
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.status(CodeSuccess.OK).send({ data: user }))
    .catch(handleErrors);
}

module.exports.updateUser = (req,res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then(user => res.send({ data: user }))
    .catch(handleErrors);
}

module.exports.updateAvatar = (req,res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(user => res.send({ data: user }))
    .catch(handleErrors);
}

// me
// module.exports.getUser = (req, res) => {
//   const { userId } = req.body;

//   User.findById(userId)
//     .then((user) => res.send(res.body))
//     .catch(handleErrors);
// }
