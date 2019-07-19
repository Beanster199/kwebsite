const express = require('express');
const app = express.Router();

app.use((req,res,next) => {
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next();
});

app.get('/login', async (req,res) => {
    res.render('auth/login.hbs')
});

module.exports = app;