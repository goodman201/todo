const {models} = require('../db');

const {validationResult} = require('express-validator');

module.exports.task = (req, res) => {
    res.render('/');
};

module.exports.taskCreate = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const tasks_count = await models.task.count({
            where: {
                status: 'TODO',
                userId: req.user.id
            }
        });
        console.log(tasks_count);


        //добавление в бд пользователя
        await models.task.create({
            title: req.body.title,
            description: req.body.description,
            userId: req.user.id,
            importance:req.body.importance,
            position: tasks_count + 1
        });

        res.sendStatus(200);
    } catch (err) {
        console.error(`ADD TASK ERROR: ${JSON.stringify(err.message || err)}`);

        res.status(500).json({
            error: 'Ошибка сервера, попробуйте позже!'
        });
    }
};

module.exports.taskUpdate = async (req, res) => {
    try {
        const {id, status} = req.params;

        if (!status || !id) {
            return res.status(400).json({
                error: 'Нет ID или STATUS!'
            });
        }


        const task = await models.task.findByPk(id);

        if (!task) {
            return res.status(400).json({
                error: 'Такого TASK не существует!'
            });
        }

        task.status = status;
        await task.save();

        res.sendStatus(200);

    } catch (err) {
        console.error(`UPDATE TASK ERROR: ${JSON.stringify(err.message || err)}`);

        res.status(500).json({
            error: 'Ошибка сервера, попробуйте позже!'
        });
    }
};

module.exports.taskDelete = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({
                error: 'Нет ID!'
            });
        }


        const task = await models.task.findByPk(id);

        if (!task) {
            return res.status(400).json({
                error: 'Такого TASK не существует!'
            });
        }

        await task.destroy();

        res.sendStatus(200);

    } catch (err) {
        console.error(`UPDATE TASK ERROR: ${JSON.stringify(err.message || err)}`);

        res.status(500).json({
            error: 'Ошибка сервера, попробуйте позже!'
        });
    }
};
