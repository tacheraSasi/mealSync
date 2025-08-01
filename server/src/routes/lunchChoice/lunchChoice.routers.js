const express = require('express');
const { addLunchChoice, getAllLunchChoice, deleteLunch } = require('./lunchChoice.controller');
const lunchChoiceRouter = express.Router();


lunchChoiceRouter.post('/add', addLunchChoice);
lunchChoiceRouter.get('/', getAllLunchChoice);
lunchChoiceRouter.delete('/:id', deleteLunch);

module.exports = lunchChoiceRouter;