const express = require('express');
const app = express.Router();
const connection = require('../../config/dbConnection')

app.get('/staff', async (req, res) => {
    const Owner = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 26 order by playergroups.id'
    const Dev = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 25 order by players.name desc'
    const JDev = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode  FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 24 order by players.name desc'
    const NetAdm = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 23 order by players.name desc'
    const PAdmin = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 22 order by players.name desc'
    const Admin = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 21 order by players.name desc'
    const SeniorP = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 20 order by players.name desc'
    const Senior = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 19 order by players.name desc'
    const ModP = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 18 order by players.name desc'
    const Mod = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 17 order by players.name desc'
    const TMod = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 16 order by players.name desc'
    const Builder = 'SELECT DISTINCT players.name as player,players.uuid,groups.name,country,countrycode FROM PowerfulPerms.groups Inner Join PowerfulPerms.playergroups on groups.id = groupid Inner Join PowerfulPerms.players on players.uuid = playeruuid INNER join ksystem_playerdata on ksystem_playerdata.uuid = playeruuid where groupid = 15 order by players.name desc'

    let data = []
    data.Owner = await connection.query(Owner);
    data.Dev = await connection.query(Dev);
    data.JDev = await connection.query(JDev);
    data.NetAdm = await connection.query(NetAdm);
    data.PAdmin = await connection.query(PAdmin);
    data.Admin = await connection.query(Admin);
    data.SeniorP = await connection.query(SeniorP);
    data.Senior = await connection.query(Senior);
    data.ModP = await connection.query(ModP);
    data.Mod = await connection.query(Mod);
    data.TMod = await connection.query(TMod);
    data.Builder = await connection.query(Builder);
    res.render('../views/staff.hbs', { staff: data})

});

module.exports = app;