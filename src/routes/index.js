const express = require('express');
const app = express.Router();
const connection = require('./../config/dbConnection');


app.post('/', (req,res) => {
    res.redirect('/u/' + req.body.user)
  });

app.get('/',async (req,res) => {
    const _announcements = await connection.query('SELECT kwa.title,kwa.created_at,kwa.body,ksp.name,kwa.image_header FROM kwebsite_announcements kwa INNER JOIN ksystem_playerdata ksp ON ksp.uuid = kwa.created_by WHERE disabled = 0 ORDER BY created_at DESC LIMIT 3');
    res.render('../views/index.hbs');
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