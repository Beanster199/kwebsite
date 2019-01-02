const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');;

const { database } = require('./keys');

const app = express();
require('./lib/auth');

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'))
app.disable('x-powered-by');
app.engine('.hbs', exphbs({
    defaultLayout: 'master',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Variables

app.use((req, res, next) => {
    app.locals.danger = req.flash('danger');
    app.locals.success = req.flash('success');
    app.locals.uuid = req.uuid;
    app.locals.role = req.role;
    next()
}); 

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/staff'));
app.use('/u',require('./routes/u/user'));
app.use(require('./routes/u/account'));
app.use(require('./routes/login'));
app.use(require('./routes/famous'));
app.use(require('./routes/leaderboards/global_elo'));
app.use('/auth',require('./routes/u/auth'));
//app.use(require('./routes/survival_games'));


// Assets
app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/u/assets', express.static(path.join(__dirname, './assets')));

app.listen(app.get('port'), () => {
});

