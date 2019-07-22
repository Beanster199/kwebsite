const express = require('express');
const app = express.Router();

const connection = require('../../config/dbConnection')


app.get('/famous', async (req,res) => {
    const fQuery = "SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 14 order by players.name desc"
    const yQuery = "SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 13 order by players.name desc"
    let data = []
    data.famous = await connection.query(fQuery);
    data.youtuber = await connection.query(yQuery);
    res.render('../views/famous.hbs', {mvp: data});
});

module.exports = app;