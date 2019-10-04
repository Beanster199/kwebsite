const app = require('express').Router();
const connection = require('../../config/dbConnection');;


app.use((req,res,next) => {
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }else if(req.isAuthenticated()){
        if(req.user.isAdmin){
            next();
        }else{
            return res.status(200).redirect('/');
        }
    }
});

app.get('/bans', async(req,res) => {
    console.log(req.query.search)
    let _bans;
    if(req.query.search){
        _bans = await connection.query('select id,active,time,name,banned_by_name,banned_by_uuid,ltb.uuid,ispremium,until from litebans.litebans_bans ltb inner join ksystem_playerdata ksp on ksp.uuid = ltb.uuid WHERE ltb.uuid = ? or name = ? or banned_by_name = ? or banned_by_uuid = ? or id = ? order by id desc LIMIT 20', [req.query.search,req.query.search,req.query.search,req.query.search,,req.query.search]);
    }else{
        _bans = await connection.query('select id,active,time,name,banned_by_name,banned_by_uuid,ltb.uuid,ispremium,until from litebans.litebans_bans ltb inner join ksystem_playerdata ksp on ksp.uuid = ltb.uuid order by id desc LIMIT 20');
    }
    _bans.forEach(bans => {
        if(!bans.ispremium) bans.uuid = '8667ba71-b85a-4004-af54-457a9734eed7';
        if(bans.banned_by_name === 'SYSTEM') bans.banned_by_uuid = 'b4a2b1fc-90e7-414b-ac9f-3801f8e6300d';
        if(bans.until == -1) bans.until = false;
    });
    res.render('../views/admin/bans.hbs', {bans:_bans, layout:'../admin/main.hbs'})
});

module.exports = app;