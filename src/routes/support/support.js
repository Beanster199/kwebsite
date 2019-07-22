const express = require('express');
const app = express.Router();

const connection = require('../../config/dbConnection')

app.use((req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }else if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
});


app.get('/support', async (req,res) => {
    res.render('../views/support/support.hbs')
});

module.exports = app;