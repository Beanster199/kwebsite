const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'master',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Variables

app.use((req, res, next) => {
    next()
}); 

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/staff'));
app.use('/u',require('./routes/user'))
app.use(require('./routes/login'));
app.use(require('./routes/famous'));
app.use(require('./routes/leaderboards/global_elo'));
//app.use(require('./routes/survival_games'));


// Assets
app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/u/assets', express.static(path.join(__dirname, './assets')));

app.listen(app.get('port'), () => {
});

