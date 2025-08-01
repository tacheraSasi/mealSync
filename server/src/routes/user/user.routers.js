const express = require('express');
const { userRegister, getAllUsers, getUserById, userLogin } = require('./user.controller');
const userRouter = express.Router();


userRouter.post('/login', userLogin);
userRouter.post('/register', userRegister);
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);

module.exports = userRouter;