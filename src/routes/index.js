const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('../lib/sam')


app.post('/', (req,res) => {
    console.log(req.body)
    res.redirect('/u/' + req.body.user)
  });

app.get('/', isLoggedIn ,(req,res) => {
    res.render('../views/index.hbs');
});
module.exports = app;