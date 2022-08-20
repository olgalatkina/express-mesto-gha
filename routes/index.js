const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { CodeError } = require('../constants');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res) => {
  res.status(CodeError.NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
