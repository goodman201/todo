const {models} = require('../db');

module.exports.index = async function (req, res) {
    try {
        let tasks_todo;
        let tasks_inprogress;
        let tasks_done;

        if (req.user) {
            tasks_todo = await models.task.findAll({
                where: {
                    userId: req.user.id,
                    status: 'TODO'
                },
                order: [
                    ['position', 'ASC']
                ],
                raw: true
            });
            tasks_inprogress = await models.task.findAll({
                where: {
                    userId: req.user.id,
                    status: 'IN_PROGRESS'
                },
                order: [
                    ['position', 'ASC']
                ],
                raw: true
            });
            tasks_done = await models.task.findAll({
                where: {
                    userId: req.user.id,
                    status: 'DONE'
                },
                order: [
                    ['position', 'ASC']
                ],
                raw: true
            });
        }

        res.render('pages/index', {tasks_todo, tasks_inprogress, tasks_done});
    } catch (err) {
        console.error(`INDEX ERROR: ${JSON.stringify(err.message || err)}`);

        res.status(500).json({
            error: 'Ошибка сервера, попробуйте позже!'
        });
    }
};
