const app = require('express').Router();
const ShortUniqueId = require('short-unique-id');
const moment = require('moment');

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

app.get('/search/:username', async (req,res) => {
    if(!req.params.username){
        return res.redirect('/admin/staff')
    };
    
});

app.get('/staff', async (req,res) => {
    res.render('../views/admin/staff.hbs', { layout: '../admin/main.hbs'});
});

app.get('/dev', async (req,res) => {
    let isDev = false;
    if(req.user.user_rank === 'Developer'){
        isDev = true;
    }
    const commits = await connection.query('select * from kwebsite_commits order by commit_date desc LIMIT 4')
    console.log(commits)
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