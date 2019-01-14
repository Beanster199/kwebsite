const express = require('express');
const app = express.Router();


app.post('/', (req,res) => {
    console.log(req.body)
    res.redirect('/u/' + req.body.user)
  });

app.get('/',(req,res) => {
    res.render('../views/index.hbs');
});
module.exports = app;