const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');;
const helpers = require('handlebars-helpers')();

const { database } = require('./keys');

const app = express();
require('./lib/auth');

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'))
app.disable('view cache');
app.disable('x-powered-by');
app.engine('.hbs', exphbs({
    defaultLayout: 'master',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

// Variables



// Assets
app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/support/assets', express.static(path.join(__dirname, './assets')));
app.use('/practice/assets', express.static(path.join(__dirname, './assets')));
app.use('/factions/assets', express.static(path.join(__dirname, './assets')));
app.use('/stats/assets', express.static(path.join(__dirname, './assets')));
app.use('/sg/assets', express.static(path.join(__dirname, './assets')));
app.use('/u/assets', express.static(path.join(__dirname, './assets')));
app.use('/u/:nameId/assets', express.static(path.join(__dirname, './assets')));
app.use('/admin/assets', express.static(path.join(__dirname, './assets')));
app.use('/admin/t/assets', express.static(path.join(__dirname, './assets')));
app.use('/admin/search/assets', express.static(path.join(__dirname, './assets')));
app.use('/admin/player/assets', express.static(path.join(__dirname, './assets')));

/*
    #Remember: Middlewares and Routes should go after _Assets_ for avoid multiple routes call
*/


// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(session({
    key: 'test_id',
    secret: 'secret',
    resave: true,
    cookie : {
        maxAge: 1000 * 60 * 60 *24 * 365
    },
    saveUninitialized: true,
    store: new MySQLStore(database)
  }));
app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next) => {
    if(req.isAuthenticated()){
        if(req.user){
            res.locals.bLoggedIn = true;
            res.locals.bUser = req.user;
            res.locals.bSession = req.session;
        }else{
            req.bSession = undefined;
            req.bUser = undefined;
            res.locals.bLoggedIn = undefined;
            req.logout();
        }
    }else if(!req.isAuthenticated()){
        res.locals.user = undefined;
        res.locals.session = undefined;
        res.locals.bLoggedIn = undefined;
    }
    if(false){
        console.log('--- Soy tus bAuth Variables ----')
        console.log(req.isAuthenticated())
        console.log(res.app.locals.bLoggedIn);
        console.log(res.app.locals.bUser);
        console.log('--- /End bAuth Variables ----')
        for (let i = 0; i < 20; i++) {
            console.log('')
        }
    }
    next();
});

// Routes
app.use(require('./routes/index'));
app.use('api',require('./routes/api/main'));

app.use('/u',require('./routes/u/user'));
app.use(require('./routes/community/staff'));
app.use(require('./routes/community/famous'));
app.use(require('./routes/tools'));
app.use(require('./routes/leaderboards/factions'));
app.use('/practice',require('./routes/leaderboards/leaderboards'));
app.use('/sg',require('./routes/leaderboards/survival_games'));
app.use('/stats',require('./routes/leaderboards/factions'));
/* bAuth Routes */

app.use('/auth',require('./routes/u/auth'));
app.use(require('./routes/login'));
app.use(require('./routes/support/support'));
app.use(require('./routes/u/account'));

// Admin Routes ( Should add perms l8tr)
app.use('/admin',require('./routes/admin/main.js'));
app.use('/admin',require('./routes/admin/support.js'));
app.use('/admin',require('./routes/admin/logins.js'));


app.use((req,res,next) => {
    return res.status(404).render('status/working_progress.hbs')
})

app.listen(app.get('port'), () => {
});

