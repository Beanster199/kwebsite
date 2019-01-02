const auth = require('passport');
const Strategy = require('passport-local').Strategy;
const connection = require('../config/dbConnection');
const helpers = require('../lib/helpers')

auth.use(new Strategy((req, done) => {
    console.log('test' + req)
  }));


auth.use('auth-session', new Strategy((req, done) => {
    console.log(req.body);
}, (req,done) => {
    console.log(req.body)
    const user = {
        user: 'elmarian',
        id: 3123
    }
    done(null, user)
}));

auth.use('auth-session-late', new Strategy({
    passReqToCallback: true
}, async (req, uuid, done) => {
    console.log('test' + req.body)
    console.log(uuid)
    const rows = await connection.query('SELECT * FROM kwebsite_users WHERE uuid_long = ?', [uuid]); 
    const user = rows[0]
    return;
    if (rows.length > 0){
        const user = rows[0];
        done(null, user);
    } else {
        done(null, false);
    }
    //newUser.password = helpers.registerPassword(password);
    //return done(null, newUser); 
}));


auth.serializeUser((user, done) => {
    done(null, user.uuid);
  });
  
auth.deserializeUser(async (uuid, done) => {
    const rows = await pool.query('SELECT * FROM ksystem.kwebsite_users uuid_long = ?', [uuid]);
    done(null, rows[0]);
  });
