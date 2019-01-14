const express = require('express');
const app = express.Router();
const localStorage = require('localStorage')
const { isLoggedIn } = require('../../lib/sam')

const auth = require('passport');

app.get('/account', async (req, res) => {
    res.render('../views/u/account.hbs');
    if (localStorage._authID) {
        const user = await connection.query('SELECT ID, kur_uuid as UUID,kwe_name as username,kwe_register as register, "" as password FROM kwebsite_users_registers INNER JOIN kwebsite_users as ku on ku.uuid_long=kur_uuid WHERE kur_IP ="' + ip + '" and ID="' + localStorage._authID + '" and kur_date between "' + date_ago.toLocaleString() + '" and "' + new Date().toLocaleString() + '" ORDER BY kur_date DESC LIMIT 1')
        localStorage.removeItem('_authID')  

    }  else {
        //isLoggedIn()
    }
});
app.post('/account',/* isLoggedIn , */ auth.authenticate('auth.session', {
            successRedirect: '/login',
            failureRedirect: '/',
            failureFlash: true
        }));


module.exports = app;