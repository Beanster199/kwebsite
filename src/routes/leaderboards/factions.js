const app = require('express').Router();
const connection = require('../../config/dbConnection');

app.get('/factions',async (req,res) => {
    res.render('../views/leaderboards/factions/factions.hbs');
});

module.exports = app;