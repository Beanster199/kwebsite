const express = require('express');
const app = express.Router();
const connection = require('../config/dbConnection');

app.get('/:nameId', async (req, res) => {
    if (req.params.nameId) {
        const query = 'SELECT kwe_lastlogin as lastlogin,kwe_name as name FROM kwebsite_users where kwe_name = "Benster_199"';
        const friends = await connection.query('select * from kwebsite_friends')
        const profile = await connection.query(query)
        console.log(profile)
            if (profile.length > 0) {
                console.log(profile )
                console.log(profile[0].lastlogin)
                res.render('../views/u/user_profile.hbs' , {
                    user: profile,
                    friends: friends
                  }
                )
            } 
//            else {
//                res.render('status/user_404', {
//                    error: req.params.nameId
//               });
//        };
//        return console.log(req.params.nameId);
    } else {
        res.redirect('/')
    }
});

module.exports = app