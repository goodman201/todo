const express = require('express');
const {body} = require('express-validator');

const controller = require('../controllers/tasks');
const router = express.Router();

router.get('/', controller.task);

router.post('/', [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('*Please fill in this field.')
        .isLength({max:128})
        .withMessage('*Number of characters exceeded'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('*Please fill in this field.')
], controller.taskCreate);

router.post('/:id/:status', controller.taskUpdate);

router.delete('/:id', controller.taskDelete);



module.exports = router;