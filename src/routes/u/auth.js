const express = require('express');
const app = express.Router();
const auth = require('passport');
const publicIp = require('public-ip')


app.get('/:auth_token', async (req, res, next) => {
    if(!req.isAuthenticated()){
        if(req.params.auth_token){
            req.query = req.params
            if(req.get('host') === 'localhost:3000'){
                req.query.ip = await publicIp.v4();
            }else{
                req.query.ip = req.headers["x-forwarded-for"]
            }
            auth.authenticate('token-login',(err,user,info) => {
                if(user){
                    req.logIn(user,(err) => {
                        console.log(user)
                        if(err){
                            console.log(err)
                            return res.redirect('/login');
                        }else{
                            if(req.isAuthenticated()){
                                console.log(req.session.passport)
                                if(!req.user.authenticated){
                                    return res.redirect('/account');
                                }else{
                                    return res.redirect('/');
                                };
                            };
                        };
                    });
                }else{
                    return res.redirect('/login');
                };
            })(req,res,next);
        }
    }else{
        return res.redirect('/');
    }
});
    /*const user = await connection.query('SELECT ID, kur_uuid as UUID,kwe_name as username,kwe_register as register, "" as password FROM kwebsite_users_registers INNER JOIN kwebsite_users as ku on ku.uuid_long=kur_uuid WHERE kur_IP ="' + ip + '" and ID="' + req.params.regID + '" and kur_date between "' + date_ago.toLocaleString() + '" and "' + new Date().toLocaleString() + '" ORDER BY kur_date DESC LIMIT 1')
    if (user.length > 0) {
        req.body = user[0];
        localStorage.setItem("_authID", user[0].ID)
        res.redirect('/account');
    } else {
        res.redirect('/');
    };*/
/*
app.get('/:regID',
    auth.authenticate('auth.session', {
        successRedirect: '/login',
        failureRedirect: '/',
        failureFlash: true
    }));
    */
module.exports = app;