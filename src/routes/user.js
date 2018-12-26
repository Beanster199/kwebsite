const express = require('express');
const app = express.Router();
const connection = require('../config/dbConnection');

app.get('/:nameId', async (req, res) => {
    if (req.params.nameId) {
        const query = 'SELECT kwe_lastlogin as lastlogin,kwe_name as name FROM kwebsite_users where kwe_name = "Resucting"';
        const profile = await connection.query(query)
        console.log(profile)
            if (profile.length > 0) {
                res.render('../views/u/user_profile.hbs', {
                    user: profile
                })
            } else {
                res.render('status/user_404', {
                    error: req.params.nameId
                });
        };
        return console.log(req.params.nameId);
    } else {
        res.redirect('/')
    }
});

module.exports = app