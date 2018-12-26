const express = require('express');
const app = express.Router();

const connection = require('../config/dbConnection');

app.get('/add', (req,res) => {
    res.render('../views/index.hbs');
});

module.exports = app;