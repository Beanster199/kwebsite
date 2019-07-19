const app = require('express').Router();

app.get('/clicks', async (req,res) => {
    res.render('../views/clicks.hbs');
});

module.exports = app;