const express = require('express');
const app = express.Router();


app.post('/', (req,res) => {
    res.redirect('/u/' + req.body.user)
  });

app.get('/',(req,res) => {
    console.log(res.locals.user)
    res.render('../views/index.hbs');
});

app.get('/logout', (req,res) => {
  req.logOut();
  req.logout();
  res.app.locals.bLoggedIn = undefined;
  res.app.locals.user = undefined;
  res.app.locals.session = undefined;
  res.app.locals.isAdmin = undefined;
  res.locals.bLoggedIn = undefined;
  res.locals.user = undefined;
  res.locals.session = undefined;
  res.locals.isAdmin = undefined;
  res.redirect('/login');
})


module.exports = app;