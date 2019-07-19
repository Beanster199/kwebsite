const express = require('express');
const app = express.Router();
const connection = require('../../config/dbConnection');
const { format } = require('timeago.js')

app.get('/global',async (req,res) => {
    const _wins = await connection.query('select wins,uuid,name from ksystem.ksystem_kgames where wins <> 0 order by wins desc LIMIT 10')
    const _kills = await connection.query('select uuid,name,kills from ksystem.ksystem_kgames where kills <> 0 order by kills desc LIMIT 10')
    const _chests = await connection.query('select uuid,name,chestsOpened from ksystem.ksystem_kgames where chestsOpened <> 0 order by chestsOpened desc LIMIT 10')
    const _deaths = await connection.query('select uuid,name,deaths from ksystem.ksystem_kgames where deaths <> 0 order by deaths desc LIMIT 10')
    let i = 1;
    _wins.forEach(win => {
        win.count = i;
        i++;
    });
    i = 1
    _kills.forEach(kill => {
        kill.count = i;
        i++
    });
    i = 1
    _chests.forEach(chest => {
        chest.count = i;
        i++
    });
    i = 1
    _deaths.forEach(death => {
        death.count = i;
        i++
    });
    res.render('leaderboards/sg/global.hbs', { wins: _wins, kills: _kills, chests: _chests, deaths: _deaths})
})

module.exports = app;