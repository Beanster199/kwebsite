const app = require('express').Router();
const connection = require('../../config/dbConnection');

app.get('/factions/global',async (req,res) => {
    const _factions = {};
    _factions.playtime = await connection.query('select * from ksystem_kfactions order by playtime + 0 DESC LIMIT 20')
    _factions.kills = await connection.query('select * from ksystem_kfactions order by kills + 0 DESC LIMIT 20');
    _factions.diamonds = await connection.query('select * from ksystem_kfactions_mining order by DIAMOND + 0 desc limit 20');
    _factions.deaths = await connection.query('select * from ksystem_kfactions order by deaths + 0 DESC LIMIT 20');
    _factions.expcollected = await connection.query('select * from ksystem_kfactions order by expcollected + 0 DESC LIMIT 20');
    for (let i = 0; i < _factions.playtime.length; i++) {
        _factions.playtime[i].count = i + 1;
    }
    for (let i = 0; i < _factions.kills.length; i++) {
        _factions.kills[i].count = i + 1;
    }
    for (let i = 0; i < _factions.diamonds.length; i++) {
        _factions.diamonds[i].count = i + 1;
    }
    for (let i = 0; i < _factions.deaths.length; i++) {
        _factions.deaths[i].count = i + 1;
    }
    for (let i = 0; i < _factions.expcollected.length; i++) {
        _factions.expcollected[i].count = i + 1;
    }
    res.render('../views/leaderboards/factions/factions.hbs', {factions:_factions});
});

app.get('/factions/death-list', async (req,res) => {
    const _deaths = await connection.query('select * from ksystem_kfactions_kills order by date desc')
    res.render('../views/leaderboards/factions/factions_death_list.hbs', { deaths:_deaths });
});

module.exports = app;