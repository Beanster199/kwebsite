const app = require('express').Router();

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


app.get('/staff', async (req,res) => {
    res.render('../views/admin/staff.hbs', { layout: '../admin/main.hbs'});
});

module.exports = app;