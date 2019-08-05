const auth = require('passport');
const Strategy = require('passport-local').Strategy;
const express = require('express')

const app = express()

const connection = require('../config/dbConnection');
const helpers = require('../lib/helpers')

/*
auth.use('token-login', new Strategy({
  usernameField: 'auth_token',
  passwordField: 'ip',
  passReqToCallback: true
},
  async (req,token,ip, done) => {
    let date_ago = new Date();
    date_ago.setMinutes(date_ago.getMinutes() - 1024)
    console.log(`SELECT token,kut.uuid,name FROM kwebsite_users_tokens kut INNER JOIN ksystem_playerdata ksp ON ksp.uuid = kut.uuid WHERE token = ${token} and kut.address = ${ip} and servertime between ${date_ago.toISOString().slice(0, 19).replace('T', ' ')} and ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`)
    const _token = await connection.query('SELECT token,kut.uuid,name FROM kwebsite_users_tokens kut INNER JOIN ksystem_playerdata ksp ON ksp.uuid = kut.uuid WHERE token = ? and kut.address = ? and servertime between ? and ?', [token,ip,date_ago.toISOString().slice(0, 19).replace('T', ' '),new Date().toISOString().slice(0, 19).replace('T', ' ')]);
    console.log(_token)
    if(!_token[0] || !_token){
      console.log('Token invalido o usuario no encontrado. Retornando user:false;')
      return done(null,false)
    }
    req.app.locals.bLoggedIn = true;
    req.app.locals.uuid = _token[0].uuid
    req.app.locals.name = _token[0].name
    done(null,_token[0])
  }
));

*/
auth.use('user-login', new Strategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req,username,password,done) => {
  const _user = await connection.query('SELECT uuid,name,password,website_authenticated as authenticated,isAdmin FROM ksystem_playerdata WHERE name = ?',username);
  if(!_user[0] || !await helpers.loginPassword(password,_user[0].password)){
    return done(null,false);
  }
  delete _user[0].password;
  const _rank = await connection.query('select name from PowerfulPerms.playergroups ppp INNER JOIN PowerfulPerms.groups ppg on ppg.id = ppp.groupid WHERE ppg.id <> 6 and ppp.playeruuid = ?',_user[0].uuid)
  req.app.locals.user_rank = _rank[0].name
  req.app.locals.bLoggedIn = true;
  req.app.locals.uuid = _user[0].uuid;
  req.app.locals.name = _user[0].name;
  req.app.locals.isAdmin = _user[0].isAdmin;
  done(null,_user[0]);
  },
));

auth.serializeUser(function(user, done) {
  console.log('Soy tu serializarUsuario')
  console.log(user)
  done(null, user);
});

auth.deserializeUser(async (user, done) => {
  const _row = await connection.query('SELECT uuid,name,address,website_authenticated as authenticated, isAdmin FROM ksystem_playerdata WHERE uuid = ?', user.uuid)
  if (!_row[0]){
    done(null,false)
  }
  done(null, _row[0]);
});