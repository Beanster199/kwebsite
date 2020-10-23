const express = require('express');
const app = express.Router();
const connection = require('../../config/dbConnection');

 /* [Global Elo] */

app.get('/global', async (req,res) => {
    let data = await connection.query('SELECT UUID,name as Username,global as GlobalElo FROM ksystem_kpractice WHERE global <> 0 ORDER BY global DESC LIMIT 20');
    let rankeds = await connection.query('SELECT UUID, RankedWins, name as Username FROM ksystem_kpractice WHERE RankedWins > 0 ORDER BY RankedWins DESC LIMIT 20');
    let losses = await connection.query('SELECT name as Username, RankedLosses, UUID FROM ksystem_kpractice WHERE RankedLosses > 0 ORDER BY RankedLosses DESC LIMIT 20');
    for (let i = 0; i < data.length; i++) {
        data[i].count = i + 1
    } 
    for (let i = 0; i < rankeds.length; i++) {
        rankeds[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/top.hbs', { global : data, rankeds : rankeds, losses : losses });
})

 /* [Archer] */

app.get('/archer', async (req,res) => {
    let elo = await connection.query('SELECT e82d3107_2285_4cbd_8052_cd167fc53a01 as elo, UUID, name as Username FROM `ksystem_kpractice` WHERE e82d3107_2285_4cbd_8052_cd167fc53a01 <> 0 ORDER BY e82d3107_2285_4cbd_8052_cd167fc53a01 DESC LIMIT 10');
    let wins = await connection.query('SELECT COUNT(killerID) as wins, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on killerId = ksystem_kpractice.uuid WHERE style = "e82d3107_2285_4cbd_8052_cd167fc53a01" GROUP BY killerid ORDER BY wins DESC LIMIT 10');
    let losses = await connection.query('SELECT COUNT(deathID) as losses, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on deathID = ksystem_kpractice.uuid WHERE style = "e82d3107_2285_4cbd_8052_cd167fc53a01" GROUP BY deathid ORDER BY losses DESC LIMIT 10');
    for (let i = 0; i < elo.length; i++) {
        elo[i].count = i + 1
    } 
    for (let i = 0; i < wins.length; i++) {
        wins[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/archer.hbs', { elo : elo, wins : wins, losses : losses });
})

 /* [Axe PvP] */

app.get('/axepvp', async (req,res) => {
    let elo = await connection.query('SELECT 08dc2105_acaf_4dd9_9f23_782ac1a5c07c as elo, UUID, name as Username FROM `ksystem_kpractice` WHERE 08dc2105_acaf_4dd9_9f23_782ac1a5c07c <> 0 ORDER BY 08dc2105_acaf_4dd9_9f23_782ac1a5c07c DESC LIMIT 10');
    let wins = await connection.query('SELECT COUNT(killerID) as wins, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on killerId = ksystem_kpractice.uuid WHERE style = "08dc2105_acaf_4dd9_9f23_782ac1a5c07c" GROUP BY killerid ORDER BY wins DESC LIMIT 10');
    let losses = await connection.query('SELECT COUNT(deathID) as losses, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on deathID = ksystem_kpractice.uuid WHERE style = "08dc2105_acaf_4dd9_9f23_782ac1a5c07c" GROUP BY deathid ORDER BY losses DESC LIMIT 10');
    for (let i = 0; i < elo.length; i++) {
        elo[i].count = i + 1
    } 
    for (let i = 0; i < wins.length; i++) {
        wins[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/axepvp.hbs', { elo : elo, wins : wins, losses : losses });
})

/* [Build UHC] */

app.get('/builduhc', async (req,res) => {
    let elo = await connection.query('SELECT e48e52c7_ae57_463b_979d_6916b80b6b20 as elo, UUID, name as Username FROM `ksystem_kpractice` WHERE e48e52c7_ae57_463b_979d_6916b80b6b20 <> 0 ORDER BY e48e52c7_ae57_463b_979d_6916b80b6b20 DESC LIMIT 10');
    let wins = await connection.query('SELECT COUNT(killerID) as wins, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on killerId = ksystem_kpractice.uuid WHERE style = "e48e52c7_ae57_463b_979d_6916b80b6b20" GROUP BY killerid ORDER BY wins DESC LIMIT 10');
    let losses = await connection.query('SELECT COUNT(deathID) as losses, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on deathID = ksystem_kpractice.uuid WHERE style = "e48e52c7_ae57_463b_979d_6916b80b6b20" GROUP BY deathid ORDER BY losses DESC LIMIT 10');
    for (let i = 0; i < elo.length; i++) {
        elo[i].count = i + 1
    } 
    for (let i = 0; i < wins.length; i++) {
        wins[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/builduhc.hbs', { elo : elo, wins : wins, losses : losses });
})

/* [Debuff] */

app.get('/debuff', async (req,res) => {
    let elo = await connection.query('SELECT b1267f0d_cdf3_4e18_94c3_6f41a8a81104 as elo, UUID, name as Username FROM `ksystem_kpractice` WHERE b1267f0d_cdf3_4e18_94c3_6f41a8a81104 <> 0 ORDER BY b1267f0d_cdf3_4e18_94c3_6f41a8a81104 DESC LIMIT 10');
    let wins = await connection.query('SELECT COUNT(killerID) as wins, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on killerId = ksystem_kpractice.uuid WHERE style = "b1267f0d_cdf3_4e18_94c3_6f41a8a81104" GROUP BY killerid ORDER BY wins DESC LIMIT 10');
    let losses = await connection.query('SELECT COUNT(deathID) as losses, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on deathID = ksystem_kpractice.uuid WHERE style = "b1267f0d_cdf3_4e18_94c3_6f41a8a81104" GROUP BY deathid ORDER BY losses DESC LIMIT 10');
    for (let i = 0; i < elo.length; i++) {
        elo[i].count = i + 1
    } 
    for (let i = 0; i < wins.length; i++) {
        wins[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/debuff.hbs', { elo : elo, wins : wins, losses : losses });
})

/* [Gapple] */

app.get('/gapple', async (req,res) => {
    let elo = await connection.query('SELECT 2cf83809_ec78_4b4e_8386_b67969d7f7a7 as elo, UUID, name as Username FROM `ksystem_kpractice` WHERE b1267f0d_cdf3_4e18_94c3_6f41a8a81104 <> 0 ORDER BY 2cf83809_ec78_4b4e_8386_b67969d7f7a7 DESC LIMIT 10');
    let wins = await connection.query('SELECT COUNT(killerID) as wins, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on killerId = ksystem_kpractice.uuid WHERE style = "2cf83809_ec78_4b4e_8386_b67969d7f7a7" GROUP BY killerid ORDER BY wins DESC LIMIT 10');
    let losses = await connection.query('SELECT COUNT(deathID) as losses, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on deathID = ksystem_kpractice.uuid WHERE style = "2cf83809_ec78_4b4e_8386_b67969d7f7a7" GROUP BY deathid ORDER BY losses DESC LIMIT 10');
    for (let i = 0; i < elo.length; i++) {
        elo[i].count = i + 1
    } 
    for (let i = 0; i < wins.length; i++) {
        wins[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/gapple.hbs', { elo : elo, wins : wins, losses : losses });
})

/* [No Debuff] */

app.get('/nodebuff', async (req,res) => {
    let elo = await connection.query('SELECT 4bb1b780_08e1_4e72_8768_1d57c1e3bb35 as elo, UUID, name as Username FROM `ksystem_kpractice` WHERE 4bb1b780_08e1_4e72_8768_1d57c1e3bb35 <> 0 ORDER BY 4bb1b780_08e1_4e72_8768_1d57c1e3bb35 DESC LIMIT 10');
    let wins = await connection.query('SELECT COUNT(killerID) as wins, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on killerId = ksystem_kpractice.uuid WHERE style = "4bb1b780_08e1_4e72_8768_1d57c1e3bb35" GROUP BY killerid ORDER BY wins DESC LIMIT 10');
    let losses = await connection.query('SELECT COUNT(deathID) as losses, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on deathID = ksystem_kpractice.uuid WHERE style = "4bb1b780_08e1_4e72_8768_1d57c1e3bb35" GROUP BY deathid ORDER BY losses DESC LIMIT 10');
    for (let i = 0; i < elo.length; i++) {
        elo[i].count = i + 1
    } 
    for (let i = 0; i < wins.length; i++) {
        wins[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/nodebuff.hbs', { elo : elo, wins : wins, losses : losses });
})

/* [No Enchants] */

app.get('/noenchants', async (req,res) => {
    let elo = await connection.query('SELECT 26925d22_aa3c_4d4a_8dd8_e2d64546d755 as elo, UUID, name as Username FROM `ksystem_kpractice` WHERE 26925d22_aa3c_4d4a_8dd8_e2d64546d755 <> 0 ORDER BY 26925d22_aa3c_4d4a_8dd8_e2d64546d755 DESC LIMIT 10');
    let wins = await connection.query('SELECT COUNT(killerID) as wins, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on killerId = ksystem_kpractice.uuid WHERE style = "26925d22_aa3c_4d4a_8dd8_e2d64546d755" GROUP BY killerid ORDER BY wins DESC LIMIT 10');
    let losses = await connection.query('SELECT COUNT(deathID) as losses, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on deathID = ksystem_kpractice.uuid WHERE style = "26925d22_aa3c_4d4a_8dd8_e2d64546d755" GROUP BY deathid ORDER BY losses DESC LIMIT 10');
    for (let i = 0; i < elo.length; i++) {
        elo[i].count = i + 1
    } 
    for (let i = 0; i < wins.length; i++) {
        wins[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/noenchant.hbs', { elo : elo, wins : wins, losses : losses });
})

 /* [Soup] */

 app.get('/soup', async (req,res) => {
    let elo = await connection.query('SELECT a2ea95ed_75e1_4ca3_acb1_3895795a4c70 as elo, UUID, name as Username FROM `ksystem_kpractice` WHERE a2ea95ed_75e1_4ca3_acb1_3895795a4c70 <> 0 ORDER BY a2ea95ed_75e1_4ca3_acb1_3895795a4c70 DESC LIMIT 10');
    let wins = await connection.query('SELECT COUNT(killerID) as wins, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on killerId = ksystem_kpractice.uuid WHERE style = "a2ea95ed_75e1_4ca3_acb1_3895795a4c70" GROUP BY killerid ORDER BY wins DESC LIMIT 10');
    let losses = await connection.query('SELECT COUNT(deathID) as losses, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on deathID = ksystem_kpractice.uuid WHERE style = "a2ea95ed_75e1_4ca3_acb1_3895795a4c70" GROUP BY deathid ORDER BY losses DESC LIMIT 10');
    for (let i = 0; i < elo.length; i++) {
        elo[i].count = i + 1
    } 
    for (let i = 0; i < wins.length; i++) {
        wins[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/soup.hbs', { elo : elo, wins : wins, losses : losses });
})

/* [Spleef] */

app.get('/spleef', async (req,res) => {
    let elo = await connection.query('SELECT 49f894cc_93b8_4419_afbb_1d51f8f25b93 as elo, UUID, name as Username FROM `ksystem_kpractice` WHERE 49f894cc_93b8_4419_afbb_1d51f8f25b93 <> 0 ORDER BY 49f894cc_93b8_4419_afbb_1d51f8f25b93 DESC LIMIT 10');
    let wins = await connection.query('SELECT COUNT(killerID) as wins, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on killerId = ksystem_kpractice.uuid WHERE style = "49f894cc_93b8_4419_afbb_1d51f8f25b93" GROUP BY killerid ORDER BY wins DESC LIMIT 10');
    let losses = await connection.query('SELECT COUNT(deathID) as losses, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on deathID = ksystem_kpractice.uuid WHERE style = "49f894cc_93b8_4419_afbb_1d51f8f25b93" GROUP BY deathid ORDER BY losses DESC LIMIT 10');
    for (let i = 0; i < elo.length; i++) {
        elo[i].count = i + 1
    } 
    for (let i = 0; i < wins.length; i++) {
        wins[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/spleef.hbs', { elo : elo, wins : wins, losses : losses });
})

/* [Sumo] */

app.get('/sumo', async (req,res) => {
    let elo = await connection.query('SELECT 49025c18_254a_41e2_9646_17f7d95a29fa as elo, UUID, name as Username FROM `ksystem_kpractice` WHERE 49025c18_254a_41e2_9646_17f7d95a29fa <> 0 ORDER BY 49025c18_254a_41e2_9646_17f7d95a29fa DESC LIMIT 10');
    let wins = await connection.query('SELECT COUNT(killerID) as wins, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on killerId = ksystem_kpractice.uuid WHERE style = "49025c18_254a_41e2_9646_17f7d95a29fa" GROUP BY killerid ORDER BY wins DESC LIMIT 10');
    let losses = await connection.query('SELECT COUNT(deathID) as losses, UUID, name as Username FROM `ksystem_kpractice_ranked` INNER JOIN ksystem_kpractice on deathID = ksystem_kpractice.uuid WHERE style = "49025c18_254a_41e2_9646_17f7d95a29fa" GROUP BY deathid ORDER BY losses DESC LIMIT 10');
    for (let i = 0; i < elo.length; i++) {
        elo[i].count = i + 1
    } 
    for (let i = 0; i < wins.length; i++) {
        wins[i].count = i + 1
    } 
    for (let i = 0; i < losses.length; i++) {
        losses[i].count = i + 1
    } 
    res.render('../views/leaderboards/practice/sumo.hbs', { elo : elo, wins : wins, losses : losses });
})

module.exports = app;