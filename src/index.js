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
const helpers = require('handlebars-helpers')();

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

// Variables



// Assets
app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/support/assets', express.static(path.join(__dirname, './assets')));
app.use('/practice/assets', express.static(path.join(__dirname, './assets')));
app.use('/sg/assets', express.static(path.join(__dirname, './assets')));
app.use('/u/assets', express.static(path.join(__dirname, './assets')));
app.use('/u/:nameId/assets', express.static(path.join(__dirname, './assets')));
app.use('/admin/assets', express.static(path.join(__dirname, './assets')));
app.use('/admin/t/assets', express.static(path.join(__dirname, './assets')));


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
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.danger = req.flash('danger');
    app.locals.success = req.flash('success');
    next()
}); 

app.use((req,res,next) => {
    if(req.isAuthenticated()){
        if(!req.app.locals.bLoggedIn || !req.app.locals.uuid || !req.app.locals.name){
            req.app.locals.bLoggedIn = undefined;
            req.app.locals.isAdmin = undefined;
            req.app.locals.uuid = undefined;
            req.app.locals.name = undefined;
            req.logout();
        };
    }else if(!req.isAuthenticated()){
        if(req.app.locals.bLoggedIn || req.app.locals.uuid || req.app.locals.name){
            req.app.locals.bLoggedIn = undefined;
            req.app.locals.isAdmin = undefined;
            req.app.locals.uuid = undefined;
            req.app.locals.name = undefined;
        };
    };
    if(false){
        console.log('--- Soy tus bAuth Variables ----')
        console.log(req.isAuthenticated())
        console.log(req.app.locals.bLoggedIn);
        console.log(req.app.locals.uuid);
        console.log(req.app.locals.name);
        console.log('--- /End bAuth Variables ----')
        for (let i = 0; i < 20; i++) {
            console.log('')
        }
    }
    next();
});

// Routes
app.use(require('./routes/index'));

app.use('/auth',require('./routes/u/auth'));
app.use(require('./routes/login'));
app.use(require('./routes/support/support'));
app.use(require('./routes/community/staff'));
app.use('/u',require('./routes/u/user'));
app.use(require('./routes/community/famous'));
app.use(require('./routes/tools'));
app.use('/practice',require('./routes/leaderboards/leaderboards'));
app.use('/sg',require('./routes/leaderboards/survival_games'));
app.use(require('./routes/u/account'));

// Admin Routes ( Should add perms l8tr)
app.use('/admin',require('./routes/admin/main.js'));
app.use('/admin',require('./routes/admin/support.js'));




app.listen(app.get('port'), () => {
});

