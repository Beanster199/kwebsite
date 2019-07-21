const express = require('express');
const app = express.Router();
const auth = require('passport');


const { NotLoggedIn } = require('./../lib/sam');

app.get('/login', NotLoggedIn, async (req,res) => {
    res.render('auth/login.hbs')
});

app.post('/login', async (req,res,next) => {
    if(!req.body || req.body.csrfmiddlewaretoken != 'SSD5RE5BKVioU7pOl9bkXHxSC6sKJmmt'){
        return res.status(413).json({message:'Unauthorized'});
    }
    req.query = req.body;

    auth.authenticate('user-login', (err,user,info) => {
        if(user){
            req.logIn(user,(err)=>{
                if(err){
                    console.log(err);
                    return res.redirect('/login');
                }else{
                    if(req.isAuthenticated()){
                        console.log('ola soy tu autenticado')
                        console.log(user)
                        if(!req.user.authenticated){
                            return res.redirect('/account');
                        }else{
                            return res.redirect('/');
                        };
                    }
                }
            });
        }else{
            return res.redirect('/login');
        }
    })(req,res,next);
});

module.exports = app;