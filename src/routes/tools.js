const app = require('express').Router();

app.get('/clicks', async (req,res) => {
    res.render('../views/clicks.hbs');
});

app.get('/rules', async(req,res) => {
    res.render('../views/rules.hbs');
});

app.get('/countdown', async (req,res) => {

});

module.exports = app;