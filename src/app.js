const express = require('express');
const passport = require('passport');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const LocalStrategy = require('passport-local').Strategy;
const sequelize = require('./database.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));

const User = require('./user.js');
User.sync({ alter: true });
app.set('view engine', 'pug');

const sessionStore = new SequelizeStore({
    db: sequelize,
});
sessionStore.sync();

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    User.findOne({ where: { email: email } }).then((user) => {
        done(null, user);
    });
});

app.get('/', (req, res) =>
    req.session.passport ? res.render('index') : res.render('signup'),
);

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.create({ email, password });

    req.login(user, (err) => {
        return res.redirect('/');
    });
});

app.use(
    session({
        secret: '094vrowcd', //random string
        resave: false,
        saveUninitialized: true,
        name: 'authpassport',
        cookie: {
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
        },
        store: sessionStore,
    }),
    passport.initialize(),
    passport.session(),
);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
