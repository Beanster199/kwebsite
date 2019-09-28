const app = require('express').Router();
const connection = require('../config/dbConnection');

app.get('/clicks', async (req,res) => {
    res.render('../views/clicks.hbs');
});

app.get('/rules', async(req,res) => {
    res.render('../views/rules.hbs');
});

app.get('/countdown', async (req,res) => {

});

app.get('/map-:map', async (req,res) => {
    if(!req.params.map){
        return res.redirect('/');
    }
    req.params.map = `map-${req.params.map}`
    const _mapkit = await connection.query('select * from kwebsite_mapkit where map_id = ?',req.params.map);
    if(!_mapkit[0]){
        return res.redirect('/');
    }
    console.log(_mapkit)
    _mapkit[0].maps = _mapkit;
    res.render('../views/map-kit.hbs', {mapkit: _mapkit[0]});
});

module.exports = app;