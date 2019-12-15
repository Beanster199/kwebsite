const express = require('express');
const app = express.Router();
const connection = require('./../config/dbConnection');


app.post('/', (req,res) => {
    res.redirect('/u/' + req.body.user)
  });

app.get('/',async (req,res) => {
    console.log(res.locals.bUser)
    const _announcements = await connection.query('SELECT kwa.title,kwa.date,kwa.body,ksp.name,kwa.image_header FROM kwebsite_announcements kwa INNER JOIN ksystem_playerdata ksp ON ksp.uuid = kwa.uuid WHERE disabled = 0 ORDER BY date DESC LIMIT 3');
    res.render('../views/index.hbs', {announcements:_announcements});
});

app.get('/logout', (req,res) => {
  req.logOut();
  req.logout();
  res.locals.bLoggedIn = undefined;
  res.locals.user = undefined;
  res.locals.session = undefined;
  res.locals.isAdmin = undefined;
  res.redirect('/login');
})


module.exports = app;