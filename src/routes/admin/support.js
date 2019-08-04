const app = require('express').Router();
const connection = require('../../config/dbConnection');

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

app.get('/support', async (req,res) =>{
    const _category = await connection.query('SELECT * FROM kwebsite_tickets_categories');
    const _tickets = await connection.query('SELECT * FROM kwebsite_tickets ktw INNER JOIN kwebsite_tickets_categories ktc on ktc.id = ktw.category_id');
    const _assigned_to_you = await connection.query('SELECT * FROM kwebsite_tickets ktw INNER JOIN kwebsite_tickets_categories ktc on ktc.id = ktw.category_id INNER JOIN kwebsite_tickets_assigned kta on kta.uid = ktw.uid WHERE kta.assigned_to = ?', req.user.uuid);
    const _unassigned = await connection.query('SELECT * FROM kwebsite_tickets ktw INNER JOIN kwebsite_tickets_categories ktc on ktc.id = ktw.category_id WHERE NOT EXISTS(SELECT uid FROM kwebsite_tickets_assigned kta WHERE kta.uid = ktw.uid )');
    console.log(_tickets);
    res.render('../views/admin/support.hbs', { layout: '../admin/main.hbs', category:_category, ticket: _tickets, assigned_to_you:_assigned_to_you, unassigned:_unassigned});
})

app.get('/t/:uid', async (req,res) => {
    res.render('../views/admin/ticket.hbs', {layout: '../admin/main.hbs'})
});

/*     const count = {}
    _tickets = [{}]
    _tickets[0].open = await connection.query('SELECT kwt.uid as uid,kwt.uuid as uuid,kwt.title, ktc.category_name, ktc.color FROM kwebsite_tickets kwt INNER JOIN kwebsite_tickets_categories ktc ON ktc.id = kwt.category_id WHERE status = 0 AND NOT EXISTS( SELECT uuid FROM kwebsite_tickets_comments ktc WHERE ktc.uid = kwt.uid AND ktc.disabled = 0)');
    _tickets[0].open = _tickets[0].open[0]

    _tickets[0].response = await connection.query('SELECT kwt.uid as uid,kwt.uuid as uuid,kwt.title, ktc.category_name, ktc.color FROM kwebsite_tickets kwt INNER JOIN kwebsite_tickets_categories ktc ON ktc.id = kwt.category_id WHERE status = 0 ')

    _tickets[0].waiting_staff = await connection.query('SELECT kwt.uid as uid,kwt.uuid as uuid,kwt.title, ktc.category_name, ktc.color FROM kwebsite_tickets kwt INNER JOIN kwebsite_tickets_categories ktc ON ktc.id = kwt.category_id WHERE status = 0 AND EXISTS( SELECT uuid FROM kwebsite_tickets_comments ktc WHERE ktc.uuid != kwt.uuid AND kwt.uid = ktc.uid AND ktc.disabled = 0 ORDER BY date DESC LIMIT 1)');
    _tickets[0].waiting_staff = _tickets[0].waiting_staff[0]

    _tickets[0].waiting_player = await connection.query('SELECT kwt.uid as uid,kwt.uuid as uuid,kwt.title, ktc.category_name, ktc.color FROM kwebsite_tickets kwt INNER JOIN kwebsite_tickets_categories ktc ON ktc.id = kwt.category_id WHERE status = 0 AND EXISTS( SELECT uuid FROM kwebsite_tickets_comments ktc WHERE ktc.uuid = kwt.uuid AND kwt.uid = ktc.uid AND ktc.disabled = 0 ORDER BY date DESC LIMIT 1)');
    _tickets[0].waiting_player = _tickets[0].waiting_player[0]

    _tickets[0].assigned_to_you = await connection.query('SELECT kwt.uid as uid,kwt.uuid as uuid,kwt.title, ktc.category_name, ktc.color FROM kwebsite_tickets kwt INNER JOIN kwebsite_tickets_categories ktc ON ktc.id = kwt.category_id WHERE status = 0 AND EXISTS( SELECT assigned_to FROM kwebsite_tickets_assigned kta WHERE kta.assigned_to = kwt.uuid AND kta.disabled = 0) and kwt.uuid = ?', req.user.uuid);
    _tickets[0].assigned_to_you = _tickets[0].assigned_to_you[0]

    _tickets[0].unassigned = await connection.query('SELECT kwt.uid as uid,kwt.uuid as uuid, kwt.title, ktc.category_name, ktc.color FROM kwebsite_tickets kwt INNER JOIN kwebsite_tickets_categories ktc ON ktc.id = kwt.category_id WHERE status = 0 AND NOT EXISTS( SELECT assigned_to FROM kwebsite_tickets_assigned kta WHERE kta.assigned_to = kwt.uuid AND kta.disabled = 1) and kwt.uuid = ?', req.user.uuid)
    _tickets[0].unassigned = _tickets[0].unassigned[0];

    _tickets[0].closed = await connection.query('SELECT kwt.uid as uid,kwt.uuid as uuid, kwt.title,ktc.category_name, ktc.color FROM kwebsite_tickets kwt INNER JOIN kwebsite_tickets_categories ktc ON ktc.id = kwt.category_id WHERE status = 1');
    _tickets[0].closed = _tickets[0].closed[0];
    console.log(_tickets[0]);
     */

module.exports = app;