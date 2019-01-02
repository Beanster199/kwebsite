const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('../../lib/sam')

const auth = require('passport');

app.get('/account', /*isLoggedIn ,*/ (req, res) => {
    res.render('../views/u/account.hbs' );
    console.log(req.body)
    console.log(req.cookie)
});
app.post('/account',/* isLoggedIn , */ auth.authenticate('auth.session', {
   // if (req.body.password[0] === req.body.password[1]){
            successRedirect: '/u/',
            failureRedirect: '/',
            failureFlash: true
        }));

   // } else {
        /* TODO: DEVOLVER MENSAJE DE ERROR */
   //}



module.exports = app;