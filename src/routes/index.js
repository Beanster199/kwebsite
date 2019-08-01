const express = require('express');
const app = express.Router();


app.post('/', (req,res) => {
    res.redirect('/u/' + req.body.user)
  });

app.get('/',(req,res) => {
    res.render('../views/index.hbs');
});

app.get('/logout', (req,res) => {
  req.logOut();
  req.logout();
  req.app.locals.bLoggedIn = undefined;
  req.app.isAdmin = undefined;
  res.redirect('/login');
})
module.exports = app;