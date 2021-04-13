const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

const {models} = require('../db');

module.exports.login = (req, res) => {
    res.render('pages/auth/login');
};

module.exports.register = (req, res) => {
    res.render('pages/auth/register');
};

module.exports.registerAjax = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        //добавление в бд пользователя
        await models.user.create({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10)
        });

        res.sendStatus(200);
    } catch (err) {
        console.error(`REGISTER ERROR: ${JSON.stringify(err.message || err)}`);

        res.status(500).json({
            error: 'Ошибка сервера, попробуйте позже!'
        });
    }
};

module.exports.loginAjax = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const user = await models.user.findOne({
            where: {
                email: req.body.email
            }
        });


        if (!user) { // If no user
            return res.status(400).json({
                error: 'Неверный логин или пароль!'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) { // Check password match
            return res.status(400).json({
                error: 'Неверный логин или пароль!'
            });
        }

        console.log('User found!');

        req.login(user, () => {
            res.sendStatus(200);
        });
    } catch (err) {
        console.error(`LOGIN ERROR: ${JSON.stringify(err.message || err)}`);

        res.status(500).json({
            error: 'Ошибка сервера, попробуйте позже!'
        });
    }
};

module.exports.logOut = (req, res) => {
    req.logout();
    res.redirect('/');
};
