const app = require('express').Router();
const ShortUniqueId = require('short-unique-id');
const moment = require('moment');
const request = require('request');

const connection = require('../../config/dbConnection')
const commons = require('../../lib/helpers')
const uid = new ShortUniqueId();


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

app.get('/player/:username',async (req,res) => {
    if(!req.params.username) return res.redirect('/admin/staff');
    const _profile = await connection.query('select * from ksystem_playerdata where name = ?', req.params.username);
    if(!_profile || !_profile[0]) return res.redirect('/admin/staff');
    ((_profile[0].ispremium) ? _profile[0].ispremium = true : _profile[0].ispremium = false);
    ((_profile[0].website_authenticated) ? _profile[0].website_authenticated = true : _profile[0].website_authenticated = false);
    if(_profile[0].ispremium){
        request.get('https://api.mojang.com/user/profiles/' + _profile[0].uuid.replace(/-/g,'')  + '/names', async (err,response, body) => {
            let namesHistory = JSON.parse(body);
            for (let i = 1; i < namesHistory.length; i++) {
                namesHistory[i].changedToAt = new Date(namesHistory[i].changedToAt).toDateString()
            }
            _profile[0].names = namesHistory;
            res.render('../views/admin/player.hbs', { layout: '../admin/main.hbs', profile: _profile[0]});
        });
    }
});

app.get('/search/', async (req,res) => {
    if(!req.query.q){
        return res.redirect('/admin/staff')
    };
    const _users = await connection.query('SELECT * FROM ksystem_playerdata WHERE name like ? ', `%${req.query.q}%`)
    if(_users.length == 1) return res.redirect(`/admin/player/${_users[0].name}`);
    res.render('../views/admin/search.hbs', { layout: '../admin/main.hbs', users: _users, query: req.query.q});
});

app.get('/staff', async (req,res) => {
    res.render('../views/admin/staff.hbs', { layout: '../admin/main.hbs'});
});

app.get('/dev', async (req,res) => {
    let isDev = false;
    if(req.user.user_rank === 'Dev'){
        isDev = true;
    }
    const commits = await connection.query('select * from kwebsite_commits order by commit_date desc LIMIT 4')
    res.render('../views/admin/dev.hbs', { layout: '../admin/main.hbs', commit: commits,isDev: isDev});
});

app.post('/dev/commit', async (req,res) => {
    if(!req.body){
        return res.status(401).json({status:401,message:'Unauthorized'});
    }
    const _data = { 
        id: uid.randomUUID(6),
        uuid : req.user.uuid,
        summary : req.body.summary,
        commit_desc : req.body.commit_desc, 
        commit_date : new Date().toISOString().replace('T',' ').slice(0,19),
    }
    if(req.body.commit_release != 'on'){
        _data.commit_release = false;
    }else{
        _data.commit_release = true;
    }
    try {
        await connection.query('INSERT INTO kwebsite_commits SET ?', _data);
    } catch (err) {
        console.log(err)
    }
    res.redirect('/admin/dev')
});

module.exports = app;