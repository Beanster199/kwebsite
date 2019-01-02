const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('../../lib/sam')

const auth = require('passport');

app.get('/account', /*isLoggedIn ,*/ (req, res) => {
    res.render('../views/u/account.hbs' );
});
app.post('/account',/* isLoggedIn , */ async (req, res) => {
    req.check('id_password', 'Password is Required').notEmpty();
    req.check('id_repeat', 'Repeat Password is Required').notEmpty();
    if (req.body.password[0] === req.body.password[1]){
        auth.authenticate('auth-account', {
            successRedirect: '/u/',
            failureRedirect: '/account',
            failureFlash: true
        })
    } else {
        /* TODO: DEVOLVER MENSAJE DE ERROR */
        console.log('Contraseñas Distintas');
    }
    res.render('../views/u/account.hbs' );
});


module.exports = app;