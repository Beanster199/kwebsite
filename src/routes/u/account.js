const express = require('express');
const app = express.Router();

const salt = require('../../lib/helpers')
const connection = require('../../config/dbConnection')

app.use((req,res,next) => {
    console.log('Entraste al /account')
    console.log(req.session.passport)
    if(req.isAuthenticated()){
        next();
    }else if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
});

/*
app.use((req,res,next) => {
    
});*/

app.get('/account', async (req, res) => {
    //res.send(req.flash('change_password_error'))
    res.render('../views/u/account.hbs');
});

app.post('/account', async(req,res) => {
    if(!req.body || !req.body.csrfmiddlewaretoken){
        return res.status(413).json({message:'unauthorized'});
    };
    if(req.body.password != req.body.repeatPassword){
        return res.render('../views/u/account.hbs',{error_alert:'Your Password and confirmation password do not match.'})
    }
    try {
        const _hash = await salt.registerPassword(req.body.password)
        await connection.query('UPDATE ksystem_playerdata SET password = ?,website_authenticated = 1 WHERE uuid = ?', [_hash,req.user.uuid])
        return res.render('../views/u/account.hbs',{success_alert:'Password updated successfully.'})
    } catch (error) {
        console.log(error)
        return res.render('../views/u/account.hbs',{error_alert:'Something went wrong. Try again.'})
    }
});

app.post('/account/social-media', async (req,res) => {
    if(!req.body){
        return res.status(413).json({message:'unauthorized'});
    }

    if(req.body.email === ''){
        req.body.email = null;
    };
    if(req.body.youtube === ''){
        req.body.youtube = null;
    };
    if(req.body.twitter === ''){
        req.body.twitter = null;
    };
    if(req.body.discord === ''){
        req.body.discord = null;
    };
    if(req.body.twitch === ''){
        req.body.twitch = null;
    };
    if(req.body.steam === ''){
        req.body.steam = null;
    };    
    try {
        req.body.uuid = req.user.uuid;
        const id = await connection.query('select kum_id from kwebsite_users_media where uuid = ?', req.user.uuid);
        if(!id[0]){
            await connection.query('INSERT INTO kwebsite_users_media SET ?', req.body);
        }else{
            await connection.query('UPDATE kwebsite_users_media SET ? WHERE uuid = ?', [req.body,req.user.uuid])
        }
        req.app.locals.success_alert = 'Social Media Updated!'
        res.redirect('/account')
        req.app.locals.success_alert = false;
        return;
    } catch (err) {
        console.log(err)
        return res.json({err})
    }

});

module.exports = app;