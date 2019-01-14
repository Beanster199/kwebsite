const auth = require('passport');
const Strategy = require('passport-local').Strategy;


const connection = require('../config/dbConnection');
const helpers = require('../lib/helpers')

auth.use('auth.session', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const body = req.body
    const user = {
        username,
        password,
        body
    }
    return done(null, user);
}));

auth.use('local.signup', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    console.log(req.body)
}));

auth.serializeUser((user, done) => {
    done(null,user);
  });
  
auth.deserializeUser(async (uuid, done) => {
    const rows = await connection.query('SELECT * FROM ksystem.kwebsite_users WHERE uuid_long="c0294097-f30a-4546-99e9-e7172f9be7e2"');
    done(null, rows[0]);
  });
