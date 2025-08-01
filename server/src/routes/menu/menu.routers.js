const express = require('express');
const { addMenu, getAllMenu, updateMenu } = require('./menu.controller');
const menuRouter = express.Router();


menuRouter.post('/add', addMenu);
menuRouter.get('/', getAllMenu);
menuRouter.put('/:id', updateMenu);

module.exports = menuRouter;