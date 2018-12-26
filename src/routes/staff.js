const express = require('express');
const app = express.Router();
const connection = require('../config/dbConnection')

app.get('/', async (req, res) => {
    const staff = await connection.query('');
    res.render('../views/staff.hbs')
});

module.exports = app;