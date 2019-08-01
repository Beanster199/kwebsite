const express = require('express');
const app = express.Router();
const ShortUniqueId = require('short-unique-id');

const connection = require('../../config/dbConnection')
const uid = new ShortUniqueId();
const { format } = require('timeago.js')

app.use((req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }else if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
});


app.get('/support', async (req,res) => {
    const _tickets = await connection.query('SELECT uid,title,date,category_name FROM kwebsite_tickets INNER JOIN kwebsite_tickets_categories ktc ON category_id = ktc.id WHERE uuid = ?', req.user.uuid)
    if(_tickets[0]){
        _tickets.forEach(ticket => {
            ticket.date = format(ticket.date)
        });
    }
    res.render('../views/support/support.hbs',{tickets: _tickets})
});

app.post('/support', async (req,res) => {
    if(!req.body || !req.body.category){
        return res.status(413).json({message:'Unauthorized'});
    }
    req.body.uid = uid.randomUUID(6);
    req.body.date = new Date().toISOString().replace('T',' ').slice(0,19);
    req.body.status_id = 1;
    req.body.category_id = req.body.category;
    req.body.uuid = req.user.uuid
    delete req.body.category
    try {
        await connection.query('INSERT INTO kwebsite_tickets SET ?', req.body)
    } catch (error) {
        console.log(error)
        return res.render('../views/support/support.hbs', {error_alert:'Something went wrong, please try again later.'})
    }
    const _tickets = await connection.query('SELECT uid,title,date,category_name FROM kwebsite_tickets INNER JOIN kwebsite_tickets_categories ktc ON category_id = ktc.id WHERE uuid = ?', req.user.uuid)
    if(_tickets[0]){
        _tickets.forEach(ticket => {
            ticket.date = format(ticket.date)
        });
    }
    return res.render('../views/support/support.hbs', {tickets:_tickets,success_alert:'Thanks for your ticket! A staff member will review it as soon as posible.'})
    
});

app.get('/support/:ticket', async (req,res)=> {
    if(!req.params.ticket){
        return res.redirect('/support');
    }
    try {
        const _ticket = await connection.query('SELECT * FROM kwebsite_tickets WHERE uid = ? and uuid = ?', [req.params.ticket,req.user.uuid])
        if(!_ticket || !_ticket[0]){
            return res.redirect('/support');
        }
        _ticket[0].date = format(_ticket[0].date)
        const _comments = await connection.query('SELECT ktc.uuid,name,ktc.date,comment FROM kwebsite_tickets_comments ktc INNER JOIN ksystem_playerdata ksp on ksp.uuid = ktc.uuid WHERE uid = ? and disabled = 0', req.params.ticket);
        if(_comments){
            _comments.forEach(com => {
                if(com.uuid == _ticket[0].uuid){
                    com.staff_reply = false;
                }else{
                    com.staff_reply = true;
                }
                com.date = format(com.date);
            });
        }
        switch (_ticket[0].category_id) {
            case 1:
                res.render('../views/support/tickets/ban_appeal.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 2:
                res.render('../views/support/tickets/bug_report.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 3:
                res.render('../views/support/tickets/unban_espanol.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 4:
                res.render('../views/support/tickets/hacker_report.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 5:
                res.render('../views/support/tickets/staff_complaint.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 6:
                res.render('../views/support/tickets/ip_appeal.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 7:
                res.render('../views/support/tickets/general_support.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 8:
                res.render('../views/support/tickets/build_submission.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 9:
                res.render('../views/support/tickets/staff_application.hbs',{ticket:_ticket[0],comments:_comments})
                break;
        }
    } catch (error) {
        console.log(error)
        return res.redirect('/support')
    }

});

app.post('/support/:ticket', async (req,res) => {
    if(!req.params.ticket || !req.body){
        return res.redirect('/support');
    }
    try {
        const _ticket = await connection.query('SELECT * FROM kwebsite_tickets WHERE uid = ? and uuid = ?', [req.params.ticket,req.user.uuid]);
        if(!_ticket || !_ticket[0]){
            return res.status(413).json({message:'Unauthorized'});
        };
        _ticket[0].date = format(_ticket[0].date)
        const _data = {
            id: uid.randomUUID(36),
            comment: req.body.comment,
            date: new Date().toISOString().replace('T',' ').slice(0,19),
            uid: req.params.ticket,
            disabled: 0,
            uuid: req.user.uuid
        }
        await connection.query('INSERT INTO kwebsite_tickets_comments SET ?', _data);
        let _comments = await connection.query('SELECT ktc.uuid as uuid,name,ktc.date,comment FROM kwebsite_tickets_comments ktc INNER JOIN ksystem_playerdata ksp on ksp.uuid = ktc.uuid WHERE uid = ? and disabled = 0 ORDER BY date', req.params.ticket);
        if(_comments){
            _comments.forEach(com => {
                if(com.uuid == _ticket[0].uuid){
                    com.staff_reply = false;
                }else{
                    com.staff_reply = true;
                }
                com.date = format(com.date);
            });
        }
        switch (_ticket[0].category_id) {
            case 1:
                res.render('../views/support/tickets/ban_appeal.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 2:
                res.render('../views/support/tickets/bug_report.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 3:
                res.render('../views/support/tickets/unban_espanol.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 4:
                res.render('../views/support/tickets/hacker_report.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 5:
                res.render('../views/support/tickets/staff_complaint.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 6:
                res.render('../views/support/tickets/ip_appeal.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 7:
                res.render('../views/support/tickets/general_support.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 8:
                res.render('../views/support/tickets/build_submission.hbs',{ticket:_ticket[0],comments:_comments})
                break;
            case 9:
                res.render('../views/support/tickets/staff_application.hbs',{ticket:_ticket[0],comments:_comments})
                break;
        }
    } catch (error) {
        console.log(error)
        return res.redirect('/support');
    }
});

module.exports = app;