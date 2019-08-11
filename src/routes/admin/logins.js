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
    const _bans = await connection.query('select * from litebans.litebans_bans order by id desc LIMIT 20');
    res.render('../views/admin/bans.hbs', {bans:_bans})
});

module.exports = app;