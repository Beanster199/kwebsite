
const express = require('express');
const app = express.Router();
const connection = require('../../config/dbConnection');
const publicIp = require('public-ip');
const request = require('request');
const { format, render, cancel, register } = require('timeago.js');

app.get('/:nameId', async (req, res) => {
    if (req.params.nameId) {
        const query = 'SELECT p.name,p.uuid,country,countrycode,joined,lastjoin,lastserver,isonline FROM PowerfulPerms.players p left outer join ksystem_playerdata kp on kp.uuid = p.uuid WHERE p.name=? LIMIT 1'
        profile = await connection.query(query,req.params.nameId)
        if (profile.length == 0){
                res.render('../views/status/user_404.hbs', {
                    error: req.params.nameId
               });
            return;
        } 
        profile[0].lastjoin = format(profile[0].lastjoin)
        profile[0].views = await Counter(profile, req);
        profile[0].ranks = await connection.query('SELECT IF(until = -1, "Banned Permanently","Banned Temporarily") as banned,"" as name, uuid COLLATE utf8_general_ci as uuid, true as type, "" as color FROM litebans.litebans_bans WHERE uuid = "' + profile[0].uuid + '" and active = 1  UNION SELECT null as banned, g.name,playeruuid COLLATE utf8_general_ci as uuid, true as type, "" as color FROM PowerfulPerms.playergroups INNER JOIN PowerfulPerms.groups g on groupid = g.id WHERE playeruuid = "' + profile[0].uuid + '" UNION SELECT null as banned,kui_icon as name, kui_uuid as uuid, false as type,kui_color as color FROM kwebsite_users_icons WHERE kui_uuid = "' + profile[0].uuid + '";')
        let comments = await connection.query('SELECT kuv_usr_uuid as user, kuv_date as date, kuv_comment as comment,name FROM kwebsite_users_comments INNER JOIN ksystem_playerdata d on kuv_usr_uuid = d.uuid WHERE kuv_prf_uuid="' + profile[0].uuid + '" and kuv_deleted = 0')
        for (let i = 0; i < comments.length; i++) {
            comments[i].date = format(comments[i].date)
            console.log(comments)
        }
        request.get('https://api.mojang.com/user/profiles/' + profile[0].uuid.replace(/-/g,'')  + '/names', async (err,response, body) => {
            let namesHistory = JSON.parse(body);
            for (let i = 1; i < namesHistory.length; i++) {
                namesHistory[i].changedToAt = new Date(namesHistory[i].changedToAt).toDateString()
            }
            const media = await connection.query('SELECT * FROM kwebsite_users_media WHERE uuid = ?', profile[0].uuid)
            console.log(media)
         res.render('../views/u/user_profile.hbs' , {
                user: profile, names : namesHistory, comments : comments, media : media
            });
        })

    } else {
        res.redirect('/')
    }
});

app.get('/:nameId/practice', async (req,res) => {
    if (req.params.nameId) {
        let profile = await connection.query('SELECT p.name,p.uuid,country,countrycode,lastjoin,lastserver,isonline FROM PowerfulPerms.players p left outer join ksystem_playerdata kp on kp.uuid = p.uuid WHERE p.name="' + req.params.nameId + '" LIMIT 1');        
        if (profile.length == 0){
            res.render('../views/status/user_404.hbs', {
                error: req.params.nameId
           });
        return;
    } 
        profile[0].lastjoin = format(profile[0].lastjoin)
        profile[0].ranks = await connection.query('SELECT IF(until = -1, "Banned Permanently","Banned Temporarily") as banned,"" as name, uuid COLLATE utf8_general_ci as uuid, true as type, "" as color FROM litebans.litebans_bans WHERE uuid = "' + profile[0].uuid + '" and active = 1  UNION SELECT null as banned, g.name,playeruuid COLLATE utf8_general_ci as uuid, true as type, "" as color FROM PowerfulPerms.playergroups INNER JOIN PowerfulPerms.groups g on groupid = g.id WHERE playeruuid = "' + profile[0].uuid + '" UNION SELECT null as banned,kui_icon as name, kui_uuid as uuid, false as type,kui_color as color FROM kwebsite_users_icons WHERE kui_uuid = "' + profile[0].uuid + '";')
        profile[0].global = await connection.query('SELECT rankedwins, rankedlosses, global, unrankedwins, unrankedlosses FROM ksystem_kpractice WHERE name = "' + req.params.nameId + '"')
        profile[0].archer = await connection.query('SELECT global, sum(rankedwins) as rankedwins, sum(rankedlosses) as rankedlosses, sum(unrankedwins) as unrankedwins, sum(unrankedlosses) as unrankedlosses FROM ( SELECT e82d3107_2285_4cbd_8052_cd167fc53a01 as global, 0 as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice WHERE global and uuid = "' + profile[0].uuid + '" UNION ALL SELECT "" as global, count(1) as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where killerId = "' + profile[0].uuid + '" and style = "e82d3107_2285_4cbd_8052_cd167fc53a01" UNION ALL SELECT "" as global, 0 as rankedwins,count(1) as rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where deathId = "' + profile[0].uuid + '" and style = "e82d3107_2285_4cbd_8052_cd167fc53a01" UNION ALL SELECT "" as global,0 as rankedwins,0 AS rankedlosses, count(1) as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_unranked where killerId = "' + profile[0].uuid + '" and style = "e82d3107_2285_4cbd_8052_cd167fc53a01" UNION ALL SELECT "" as global, 0 as rankedwins,0 as rankedlosses, 0 as unrankedwins, count(1) as unrankedlosses FROM ksystem_kpractice_unranked where deathId = "' + profile[0].uuid + '" and style = "e82d3107_2285_4cbd_8052_cd167fc53a01") j')
        profile[0].axepvp = await connection.query('SELECT global, sum(rankedwins) as rankedwins, sum(rankedlosses) as rankedlosses, sum(unrankedwins) as unrankedwins, sum(unrankedlosses) as unrankedlosses FROM ( SELECT 08dc2105_acaf_4dd9_9f23_782ac1a5c07c as global, 0 as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice WHERE global and uuid = "' + profile[0].uuid + '" UNION ALL SELECT "" as global, count(1) as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where killerId = "' + profile[0].uuid + '" and style = "08dc2105_acaf_4dd9_9f23_782ac1a5c07c" UNION ALL SELECT "" as global, 0 as rankedwins,count(1) as rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where deathId = "' + profile[0].uuid + '" and style = "08dc2105_acaf_4dd9_9f23_782ac1a5c07c" UNION ALL SELECT "" as global,0 as rankedwins,0 AS rankedlosses, count(1) as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_unranked where killerId = "' + profile[0].uuid + '" and style = "08dc2105_acaf_4dd9_9f23_782ac1a5c07c" UNION ALL SELECT "" as global, 0 as rankedwins,0 as rankedlosses, 0 as unrankedwins, count(1) as unrankedlosses FROM ksystem_kpractice_unranked where deathId = "' + profile[0].uuid + '" and style = "08dc2105_acaf_4dd9_9f23_782ac1a5c07c") j')
        profile[0].builduhc = await connection.query('SELECT global, sum(rankedwins) as rankedwins, sum(rankedlosses) as rankedlosses, sum(unrankedwins) as unrankedwins, sum(unrankedlosses) as unrankedlosses FROM ( SELECT 52f0a1aa_1d4d_4c0f_be84_70defb7d39de as global, 0 as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice WHERE global and uuid = "' + profile[0].uuid + '" UNION ALL SELECT "" as global, count(1) as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where killerId = "' + profile[0].uuid + '" and style = "52f0a1aa_1d4d_4c0f_be84_70defb7d39de" UNION ALL SELECT "" as global, 0 as rankedwins,count(1) as rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where deathId = "' + profile[0].uuid + '" and style = "52f0a1aa_1d4d_4c0f_be84_70defb7d39de" UNION ALL SELECT "" as global,0 as rankedwins,0 AS rankedlosses, count(1) as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_unranked where killerId = "' + profile[0].uuid + '" and style = "52f0a1aa_1d4d_4c0f_be84_70defb7d39de" UNION ALL SELECT "" as global, 0 as rankedwins,0 as rankedlosses, 0 as unrankedwins, count(1) as unrankedlosses FROM ksystem_kpractice_unranked where deathId = "' + profile[0].uuid + '" and style = "52f0a1aa_1d4d_4c0f_be84_70defb7d39de") j')
        profile[0].debuff = await connection.query('SELECT global, sum(rankedwins) as rankedwins, sum(rankedlosses) as rankedlosses, sum(unrankedwins) as unrankedwins, sum(unrankedlosses) as unrankedlosses FROM ( SELECT b1267f0d_cdf3_4e18_94c3_6f41a8a81104 as global, 0 as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice WHERE global and uuid = "' + profile[0].uuid + '" UNION ALL SELECT "" as global, count(1) as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where killerId = "' + profile[0].uuid + '" and style = "b1267f0d_cdf3_4e18_94c3_6f41a8a81104" UNION ALL SELECT "" as global, 0 as rankedwins,count(1) as rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where deathId = "' + profile[0].uuid + '" and style = "b1267f0d_cdf3_4e18_94c3_6f41a8a81104" UNION ALL SELECT "" as global,0 as rankedwins,0 AS rankedlosses, count(1) as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_unranked where killerId = "' + profile[0].uuid + '" and style = "b1267f0d_cdf3_4e18_94c3_6f41a8a81104" UNION ALL SELECT "" as global, 0 as rankedwins,0 as rankedlosses, 0 as unrankedwins, count(1) as unrankedlosses FROM ksystem_kpractice_unranked where deathId = "' + profile[0].uuid + '" and style = "b1267f0d_cdf3_4e18_94c3_6f41a8a81104") j')
        profile[0].gapple = await connection.query('SELECT global, sum(rankedwins) as rankedwins, sum(rankedlosses) as rankedlosses, sum(unrankedwins) as unrankedwins, sum(unrankedlosses) as unrankedlosses FROM ( SELECT 2cf83809_ec78_4b4e_8386_b67969d7f7a7 as global, 0 as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice WHERE global and uuid = "' + profile[0].uuid + '" UNION ALL SELECT "" as global, count(1) as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where killerId = "' + profile[0].uuid + '" and style = "2cf83809_ec78_4b4e_8386_b67969d7f7a7" UNION ALL SELECT "" as global, 0 as rankedwins,count(1) as rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where deathId = "' + profile[0].uuid + '" and style = "2cf83809_ec78_4b4e_8386_b67969d7f7a7" UNION ALL SELECT "" as global,0 as rankedwins,0 AS rankedlosses, count(1) as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_unranked where killerId = "' + profile[0].uuid + '" and style = "2cf83809_ec78_4b4e_8386_b67969d7f7a7" UNION ALL SELECT "" as global, 0 as rankedwins,0 as rankedlosses, 0 as unrankedwins, count(1) as unrankedlosses FROM ksystem_kpractice_unranked where deathId = "' + profile[0].uuid + '" and style = "2cf83809_ec78_4b4e_8386_b67969d7f7a7") j')
        profile[0].nodebuff = await connection.query('SELECT global, sum(rankedwins) as rankedwins, sum(rankedlosses) as rankedlosses, sum(unrankedwins) as unrankedwins, sum(unrankedlosses) as unrankedlosses FROM ( SELECT 4bb1b780_08e1_4e72_8768_1d57c1e3bb35 as global, 0 as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice WHERE global and uuid = "' + profile[0].uuid + '" UNION ALL SELECT "" as global, count(1) as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where killerId = "' + profile[0].uuid + '" and style = "4bb1b780_08e1_4e72_8768_1d57c1e3bb35" UNION ALL SELECT "" as global, 0 as rankedwins,count(1) as rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where deathId = "' + profile[0].uuid + '" and style = "4bb1b780_08e1_4e72_8768_1d57c1e3bb35" UNION ALL SELECT "" as global,0 as rankedwins,0 AS rankedlosses, count(1) as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_unranked where killerId = "' + profile[0].uuid + '" and style = "4bb1b780_08e1_4e72_8768_1d57c1e3bb35" UNION ALL SELECT "" as global, 0 as rankedwins,0 as rankedlosses, 0 as unrankedwins, count(1) as unrankedlosses FROM ksystem_kpractice_unranked where deathId = "' + profile[0].uuid + '" and style = "4bb1b780_08e1_4e72_8768_1d57c1e3bb35") j')
        profile[0].noenchants = await connection.query('SELECT global, sum(rankedwins) as rankedwins, sum(rankedlosses) as rankedlosses, sum(unrankedwins) as unrankedwins, sum(unrankedlosses) as unrankedlosses FROM ( SELECT 26925d22_aa3c_4d4a_8dd8_e2d64546d755 as global, 0 as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice WHERE global and uuid = "' + profile[0].uuid + '" UNION ALL SELECT "" as global, count(1) as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where killerId = "' + profile[0].uuid + '" and style = "26925d22_aa3c_4d4a_8dd8_e2d64546d755" UNION ALL SELECT "" as global, 0 as rankedwins,count(1) as rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where deathId = "' + profile[0].uuid + '" and style = "26925d22_aa3c_4d4a_8dd8_e2d64546d755" UNION ALL SELECT "" as global,0 as rankedwins,0 AS rankedlosses, count(1) as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_unranked where killerId = "' + profile[0].uuid + '" and style = "26925d22_aa3c_4d4a_8dd8_e2d64546d755" UNION ALL SELECT "" as global, 0 as rankedwins,0 as rankedlosses, 0 as unrankedwins, count(1) as unrankedlosses FROM ksystem_kpractice_unranked where deathId = "' + profile[0].uuid + '" and style = "26925d22_aa3c_4d4a_8dd8_e2d64546d755") j')
        profile[0].soup = await connection.query('SELECT global, sum(rankedwins) as rankedwins, sum(rankedlosses) as rankedlosses, sum(unrankedwins) as unrankedwins, sum(unrankedlosses) as unrankedlosses FROM ( SELECT a2ea95ed_75e1_4ca3_acb1_3895795a4c70 as global, 0 as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice WHERE global and uuid = "' + profile[0].uuid + '" UNION ALL SELECT "" as global, count(1) as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where killerId = "' + profile[0].uuid + '" and style = "a2ea95ed_75e1_4ca3_acb1_3895795a4c70" UNION ALL SELECT "" as global, 0 as rankedwins,count(1) as rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where deathId = "' + profile[0].uuid + '" and style = "a2ea95ed_75e1_4ca3_acb1_3895795a4c70" UNION ALL SELECT "" as global,0 as rankedwins,0 AS rankedlosses, count(1) as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_unranked where killerId = "' + profile[0].uuid + '" and style = "a2ea95ed_75e1_4ca3_acb1_3895795a4c70" UNION ALL SELECT "" as global, 0 as rankedwins,0 as rankedlosses, 0 as unrankedwins, count(1) as unrankedlosses FROM ksystem_kpractice_unranked where deathId = "' + profile[0].uuid + '" and style = "a2ea95ed_75e1_4ca3_acb1_3895795a4c70") j')
        profile[0].spleef = await connection.query('SELECT global, sum(rankedwins) as rankedwins, sum(rankedlosses) as rankedlosses, sum(unrankedwins) as unrankedwins, sum(unrankedlosses) as unrankedlosses FROM ( SELECT 49f894cc_93b8_4419_afbb_1d51f8f25b93 as global, 0 as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice WHERE global and uuid = "' + profile[0].uuid + '" UNION ALL SELECT "" as global, count(1) as rankedwins,0 AS rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where killerId = "' + profile[0].uuid + '" and style = "49f894cc_93b8_4419_afbb_1d51f8f25b93" UNION ALL SELECT "" as global, 0 as rankedwins,count(1) as rankedlosses, 0 as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_ranked where deathId = "' + profile[0].uuid + '" and style = "49f894cc_93b8_4419_afbb_1d51f8f25b93" UNION ALL SELECT "" as global,0 as rankedwins,0 AS rankedlosses, count(1) as unrankedwins, 0 as unrankedlosses FROM ksystem_kpractice_unranked where killerId = "' + profile[0].uuid + '" and style = "49f894cc_93b8_4419_afbb_1d51f8f25b93" UNION ALL SELECT "" as global, 0 as rankedwins,0 as rankedlosses, 0 as unrankedwins, count(1) as unrankedlosses FROM ksystem_kpractice_unranked where deathId = "' + profile[0].uuid + '" and style = "49f894cc_93b8_4419_afbb_1d51f8f25b93") j')
        profile[0].matches = await connection.query('SELECT id,styleName,killerName,killerId,deathName,deathId,IF(killerId = "' + profile[0].uuid + '", killerElo, deathElo) as elo,date FROM ksystem.ksystem_kpractice_ranked WHERE (killerId="' + profile[0].uuid + '" or deathId="' + profile[0].uuid + '") ORDER BY date DESC LIMIT 20')
        console.log(profile[0].matches.length)
        for (let i = 0; i < profile[0].matches.length; i++) {
            profile[0].matches[i].date = format(profile[0].matches[i].date)
        }
        //profile[0].matches = await connection.query('SELECT rankedwins, rankedlosses, global, unrankedwins, unrankedlosses FROM ksystem_kpractice WHERE name = "' + req.params.nameId + '"')
        //let profile = await connection.query('select name as username,uuid from ksystem_kpractice h left outer join ksystem_kpractice_ranked s on s.killerId = h.uuid left outer join ksystem_kpractice_ranked p on p.deathId = h.uuid where name = "' + req.params.nameId + '"')
        res.render('../views/u/user_stats.hbs',{
            user: profile
        });        
    }else{
        res.redirect('/')
    }
})

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

async function Counter(profile,req){
    Date.prototype.toMysqlFormat = function() {
        return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
    };
    const ip = await publicIp.v4()
    //ip = req.headers["x-forwarded-for"]
    const uuid = profile[0].uuid;
    const date = new Date();
    const date_ago = new Date();
    date_ago.setDate(date_ago.getDate() - 1)
    const views = await connection.query('select count(kuv_uuid) as count from kwebsite_users_views WHERE kuv_uuid="' + uuid + '"')
    const last_view = await connection.query('select count(kuv_uuid) as count from kwebsite_users_views WHERE kuv_ip="' + ip + '" and kuv_uuid="' + uuid + '" and kuv_date between "' + date_ago.toMysqlFormat() + '" and "' + new Date().toMysqlFormat() +'"')
    if (last_view[0].count == 0){
        const data = {
            kuv_uuid : uuid,
            kuv_ip : ip,
            kuv_date : date
        }
        await connection.query('INSERT INTO kwebsite_users_views SET ?', data)
    }
    return views[0].count;
}

app.get('/:nameId/fight-modal/:id', async (req,res) => {
    if(req.params.nameId){
        if(req.params.id){
            let profile = await connection.query('select ID,styleName, killerName,killerId,killerElo,deathName,deathId,deathElo,date from ksystem_kpractice_ranked where Id="' + req.params.id + '"');        
            console.log(new Date(parseInt(profile[0].date)).toDateString())
            res.json(profile[0]);
        };
    };
});

/* [ User Factions Stats] */

app.get('/:nameId/factions', async (req,res) => {
    const query = 'SELECT p.name,p.uuid,country,countrycode,joined,lastjoin,lastserver,isonline FROM PowerfulPerms.players p left outer join ksystem_playerdata kp on kp.uuid = p.uuid WHERE p.name="' + req.params.nameId + '" LIMIT 1'
    profile = await connection.query(query)
    if (profile.length == 0){
            res.render('../views/status/user_404.hbs', {
                error: req.params.nameId
           });
        return;
    } 
    profile[0].lastjoin = format(profile[0].lastjoin)
    profile[0].views = await Counter(profile, req);
    profile[0].ranks = await connection.query('SELECT IF(until = -1, "Banned Permanently","Banned Temporarily") as banned,"" as name, uuid COLLATE utf8_general_ci as uuid, true as type, "" as color FROM litebans.litebans_bans WHERE uuid = "' + profile[0].uuid + '" and active = 1  UNION SELECT null as banned, g.name,playeruuid COLLATE utf8_general_ci as uuid, true as type, "" as color FROM PowerfulPerms.playergroups INNER JOIN PowerfulPerms.groups g on groupid = g.id WHERE playeruuid = "' + profile[0].uuid + '" UNION SELECT null as banned,kui_icon as name, kui_uuid as uuid, false as type,kui_color as color FROM kwebsite_users_icons WHERE kui_uuid = "' + profile[0].uuid + '";')
    res.render('../views/u/user_factions.hbs', {user:profile})
});
   
app.get('/:nameId/sg', async (req,res) => {
    const query = 'SELECT p.name,p.uuid,country,countrycode,joined,lastjoin,lastserver,isonline FROM PowerfulPerms.players p left outer join ksystem_playerdata kp on kp.uuid = p.uuid WHERE p.name="' + req.params.nameId + '" LIMIT 1'
    profile = await connection.query(query)
    if (profile.length == 0){
            res.render('../views/status/user_404.hbs', {
                error: req.params.nameId
           });
        return;
    } 
    profile[0].lastjoin = format(profile[0].lastjoin)
    profile[0].views = await Counter(profile, req);
    profile[0].ranks = await connection.query('SELECT IF(until = -1, "Banned Permanently","Banned Temporarily") as banned,"" as name, uuid COLLATE utf8_general_ci as uuid, true as type, "" as color FROM litebans.litebans_bans WHERE uuid = "' + profile[0].uuid + '" and active = 1  UNION SELECT null as banned, g.name,playeruuid COLLATE utf8_general_ci as uuid, true as type, "" as color FROM PowerfulPerms.playergroups INNER JOIN PowerfulPerms.groups g on groupid = g.id WHERE playeruuid = "' + profile[0].uuid + '" UNION SELECT null as banned,kui_icon as name, kui_uuid as uuid, false as type,kui_color as color FROM kwebsite_users_icons WHERE kui_uuid = "' + profile[0].uuid + '";')
    profile[0].stats = await connection.query('select wins,deaths,chestsOpened,kills from ksystem.ksystem_kgames where uuid = ?' ,profile[0].uuid )
    profile[0].matches = await connection.query('SELECT killer,killerId,death,deathId from ksystem.ksystem_kgames_kills where (killerId=? or deathId=?) and hasKiller = 1',[profile[0].uuid,profile[0].uuid])
    res.render('../views/u/user_sg.hbs', {user:profile})
});
module.exports = app