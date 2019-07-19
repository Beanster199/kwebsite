const auth = require('passport');
const Strategy = require('passport-local').Strategy;
const express = require('express')

const app = express()

const connection = require('../config/dbConnection');
const helpers = require('../lib/helpers')

auth.use('token-login', new Strategy({
  usernameField: 'auth_token',
  passwordField: 'ip',
  passReqToCallback: true
},
  async (req,token,ip, done) => {
    let date_ago = new Date();
    date_ago.setMinutes(date_ago.getMinutes() - 1024)
    const _token = await connection.query('SELECT kut_id,kut_uuid as uuid,name FROM kwebsite_users_tokens INNER JOIN ksystem_playerdata ksp ON ksp.uuid = kut_uuid WHERE kut_id = ? and kut_ip = ? and kut_date between ? and ?', [token,ip,date_ago.toLocaleString(),new Date().toLocaleString()])
    console.log(_token)
    if(!_token[0] || !_token){
      return done(null,false)
    }
    req.app.locals.bLoggedIn = true;
    req.app.locals.uuid = _token[0].uuid
    req.app.locals.name = _token[0].name
    done(null,_token[0].uuid)
  }
));

auth.serializeUser(function(user, done) {
  console.log('Soy tu serializarUsuario')
  console.log(user)
  done(null, user);
});

auth.deserializeUser(async (user, done) => {
  const _row = await connection.query('SELECT uuid,name,address FROM ksystem_playerdata WHERE uuid = ?', user)
  if (!_row[0]){
    done(null,false)
  }
  done(null, _row[0]);
});