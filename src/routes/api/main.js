const app = require('express').Router();


/* Kohi Points  */ 
app.get('/add_kohi_points', (req,res) => {
    console.log('GET /add_kohi_points')
});

app.post('/add_kohi_points', (req,res) => {
    console.log(req.body)
    console.log('GET /add_kohi_points')
});

/* get_friends_new */

app.get('/get_friends_new', (req,res) => {
    console.log('GET /get_friends_new')
});

app.post('/get_friends_new', (req,res) => {
    console.log(req.body)
    console.log('GET /get_friends_new')
});

/* get_login_token */

app.get('/get_login_token', (req,res) => {
    console.log('GET /get_login_token')
});

app.post('/get_login_token', (req,res) => {
    console.log(req.body)
    console.log('GET /get_login_token')
});

/* get_player */

app.get('/get_player', (req,res) => {
    console.log('GET /get_player')
});

app.post('/get_player', (req,res) => {
    console.log(req.body)
    console.log('GET /get_player')
});

/* Get Squad */

app.get('/get_squad', (req,res) => {
    console.log('get_squad')
})

app.post('/get_squad', (req,res) => {
    console.log(req.body)
    console.log('/get_squad')
});
 /* Logs_dump */

app.get('/logs_dump', (req,res) => {
    console.log('GET /logs_dump')
});

app.post('/logs_dump', (req,res) => {
    console.log(req.body)
    console.log('GET /logs_dump')
});


app.get('/server_heartbeat', (req,res) => {
    console.log('GET /server_heartbeat')
});

app.post('/server_heartbeat', (req,res) => {
    console.log(req.body)
    console.log('GET /server_heartbeat')
});


module.exports = app;