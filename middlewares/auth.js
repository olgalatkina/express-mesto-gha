const jwt = require('jsonwebtoken');
// const { NODE_ENV, JWT_SECRET } = process.env;
const UnAuthorizedError = require('../errors/UnAuthorizedError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnAuthorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  // NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
  try {
    payload = jwt.verify(token, 'dev-secret');
  } catch (err) {
    next(new UnAuthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
