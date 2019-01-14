const express = require('express');
const app = express.Router();
const connection = require('../../config/dbConnection');
const publicIp = require('public-ip');
const auth = require('passport');
const localStorage = require('localStorage')


app.get('/:regID', async (req, res, next) => {

    const date_ago = new Date();
    date_ago.setMinutes(date_ago.getMinutes() - 195)
    const ip = await publicIp.v4();
    const user = await connection.query('SELECT ID, kur_uuid as UUID,kwe_name as username,kwe_register as register, "" as password FROM kwebsite_users_registers INNER JOIN kwebsite_users as ku on ku.uuid_long=kur_uuid WHERE kur_IP ="' + ip + '" and ID="' + req.params.regID + '" and kur_date between "' + date_ago.toLocaleString() + '" and "' + new Date().toLocaleString() + '" ORDER BY kur_date DESC LIMIT 1')
    if (user.length > 0) {
        req.body = user[0];
        localStorage.setItem("_authID", user[0].ID)
        res.redirect('/account');
    } else {
        res.redirect('/');
    };
});
/*
app.get('/:regID',
    auth.authenticate('auth.session', {
        successRedirect: '/login',
        failureRedirect: '/',
        failureFlash: true
    }));
    */
module.exports = app;