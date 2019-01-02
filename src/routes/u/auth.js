const express = require('express');
const app = express.Router();
const connection = require('../../config/dbConnection');
const publicIp = require('public-ip');
const auth = require('passport');

app.get('/:regID', async (req, res, next) => {
    const date_ago = new Date();
    date_ago.setMinutes(date_ago.getMinutes() - 195)
    const ip = await publicIp.v4();
    const user = await connection.query('SELECT kur_uuid as UUID,kwe_name as username,kwe_register as register FROM kwebsite_users_registers INNER JOIN kwebsite_users as ku on ku.uuid_long=kur_uuid WHERE kur_IP ="' + ip + '" and ID="' + req.params.regID + '" and kur_date between "' + date_ago.toLocaleString() + '" and "' + new Date().toLocaleString() + '" ORDER BY kur_date DESC LIMIT 1')
    req.body.user = user[0];
    if (user.length > 0) { 
        auth.authenticate('local', (req, res) => {
            res.send({token: req.user})
        })
        // auth.authenticate('auth-session', {successRedirect: '/u/' + user[0].UUID, failureRedirect: '/', failureFlash: true })(req, res, next);
        console.log(req.body)
    } else {
        res.redirect('/');
    };
});


module.exports = app;