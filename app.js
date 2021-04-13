const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');

const db = require('./db');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

const app = express();


async function connectDB() {
    console.log(`Checking database connection...`);
    try {
        await db.authenticate();
        console.log('Database connection OK!');
    } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error.message);
        process.exit(1);
    }
}

async function init() {
    await connectDB();

    app.set('trust proxy', 1); // trust first proxy
    app.use(require('morgan')('dev'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(require('cors')());

    app.use(session({
        secret: 'supersecretkey',
        resave: false,
        saveUninitialized: false,
        cookie: {secure: false}
    }));

    // app.use((req, res, next) => {
    //    req.session.passport = {user: 180};
    //    next();
    // });

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.models.user.findByPk(id, {attributes: ['id', 'name', 'email', 'avatar'], raw: true});
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    app.use((req, res, next) => {
        console.log('User: ', req.user, req.session);

        next();
    });
    app.use(function (req, res, next) {
        res.locals.user = req.user;
        next();
    });

    // set the view engine to ejs
    app.use(expressLayouts);
    app.set('layout', __dirname + '/views/layouts/default');
    app.set('view engine', 'ejs');

    app.use('/', indexRoutes);
    app.use('/auth', authRoutes);
    app.use('/task', taskRoutes);

    app.use(express.static(__dirname + '/public'));

    app.listen(80, () => {
        console.log(`Express server started on port 80.`);
    });
}

init();
