const express = require('express');
const {body} = require('express-validator');

const controller = require('../controllers/auth');
const router = express.Router();

router.get('/login', controller.login);
router.post('/login', [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('*Please fill in this field.')
        .isEmail()
        .normalizeEmail()
        .withMessage('*Invalid e-mail.'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('*Please fill in this field.')
], controller.loginAjax);


router.get('/register', controller.register);
router.post('/register', [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('*Please fill in this field.')
        .isString(),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('*Please fill in this field.')
        .isEmail()
        .normalizeEmail()
        .withMessage('*Invalid e-mail.'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('*Please fill in this field.')
        .isLength({min: 5})
        .custom((value, {req}) => {
            if (value !== req.body.passwordRepeat) {
                throw new Error('*Passwords must match.');
            } else {
                return true;
            }
        }),
    body('passwordRepeat')
        .trim()
        .notEmpty()
        .withMessage('*Please fill in this field.')
        .isLength({min: 5})
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('*Passwords must match.');
            } else {
                return true;
            }
        })
], controller.registerAjax);

router.get('/logout', controller.logOut);

module.exports = router;