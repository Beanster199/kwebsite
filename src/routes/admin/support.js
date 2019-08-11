const app = require('express').Router();
const connection = require('../../config/dbConnection');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();

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
    const _count = await connection.query('select (select count(1) as open from kwebsite_tickets where status_id = 1) as open,(select count(1) as waiting_for_staff from kwebsite_tickets where status_id = 2) as waiting_for_staff,(select count(1) as waiting_for_player from kwebsite_tickets where status_id = 3) as waiting_for_player,(select count(1) as assigned_to_you from kwebsite_tickets ktw inner join kwebsite_tickets_assigned kta on kta.uid = ktw.uid WHERE ktw.status_id <> 4 and kta.assigned_to = ? ) as assigned_to_you,(select count(1) as unassigned from kwebsite_tickets ktw WHERE NOT EXISTS(select uid FROM kwebsite_tickets_assigned kta WHERE kta.uid = ktw.uid )and ktw.status_id <> 4) as unassigned,	(select count(1) as closed from kwebsite_tickets where status_id = 4) as closed', req.user.uuid)
    const _tickets = await connection.query('SELECT * FROM kwebsite_tickets ktw INNER JOIN kwebsite_tickets_categories ktc on ktc.id = ktw.category_id ORDER BY ktw.date desc');
    const _assigned_to_you = await connection.query('SELECT * FROM kwebsite_tickets ktw INNER JOIN kwebsite_tickets_categories ktc on ktc.id = ktw.category_id INNER JOIN kwebsite_tickets_assigned kta on kta.uid = ktw.uid WHERE kta.assigned_to = ? and status_id != 4 ORDER BY ktw.date desc', req.user.uuid);
    const _unassigned = await connection.query('SELECT * FROM kwebsite_tickets ktw INNER JOIN kwebsite_tickets_categories ktc on ktc.id = ktw.category_id WHERE NOT EXISTS(SELECT uid FROM kwebsite_tickets_assigned kta WHERE kta.uid = ktw.uid ) and status_id != 4 ORDER BY ktw.date desc');
    res.render('../views/admin/support.hbs', { layout: '../admin/main.hbs', category:_category, ticket: _tickets, assigned_to_you:_assigned_to_you, unassigned:_unassigned,count:_count[0]});
})


/* Get Tickets Body */

app.get('/t/:uid', async (req,res) => {
    const _uid = await connection.query('SELECT * FROM kwebsite_tickets WHERE uid = ?',req.params.uid); // Search uid on db
    if (!_uid || !_uid[0]){
        return res.status(200).redirect('/admin/support'); // No result ? redirect;
    }
    const _ticket = await connection.query('select kwt.uuid,kwt.date as ticket_date,kwt.category_id,ktc.category_name,ktc.color as category_color,kts.status_name,kts.color as status_color,ppg.name as group_name,ksp.name as username from kwebsite_tickets kwt INNER JOIN kwebsite_tickets_categories ktc on ktc.id = kwt.category_id INNER JOIN kwebsite_tickets_status kts on kts.id = kwt.status_id INNER JOIN ksystem_playerdata ksp on ksp.uuid = kwt.uuid LEFT OUTER JOIN PowerfulPerms.playergroups ppp on ppp.playeruuid = kwt.uuid LEFT OUTER JOIN PowerfulPerms.groups ppg on ppg.id = ppp.groupid WHERE uid = ?', req.params.uid) //
    const _body = await connection.query('SELECT * FROM kwebsite_tickets WHERE uid = ?', req.params.uid)
    const _comments = await connection.query('SELECT * FROM kwebsite_tickets_comments ktc INNER JOIN ksystem_playerdata ksp on ksp.uuid = ktc.uuid  WHERE uid = ?', req.params.uid);
    const _staff = await connection.query('select distinct g.name as rank, ppp.name as name,ppp.uuid as uuid from PowerfulPerms.playergroups ppg INNER JOIN PowerfulPerms.groups g on g.id = ppg.groupid INNER JOIN PowerfulPerms.players ppp on ppp.uuid = ppg.playeruuid WHERE g.id >= 18 order by g.id');
    const _assigned = await connection.query('select ksp.name as name from kwebsite_tickets_assigned kta inner join ksystem_playerdata ksp on ksp.uuid = kta.assigned_to WHERE kta.uid = ? order by id desc LIMIT 1', req.params.uid);
    if(_comments || _comments[0]){
        _comments.forEach(com => {
            if(com.uuid == _body[0].uuid){
                com.staff_reply = false
            }else{
                com.staff_reply = true;
            }
        });
    }
    res.render('../views/admin/ticket.hbs', {layout: '../admin/main.hbs',ticket:_ticket[0],body:_body[0], comments:_comments, staff:_staff, assigned:_assigned[0]});
    });

app.post('/t/:uid/comment', async (req,res) => {
    if(!req.body || !req.params.uid){
        return res.redirect('/admin/support')
    }
    try {
        const _data = {
            id: uid.randomUUID(36),
            comment: req.body.comment,
            date: new Date().toISOString().replace('T',' ').slice(0,19),
            uid: req.params.uid,
            disabled: 0,
            uuid: req.user.uuid
        }
        await connection.query('INSERT INTO kwebsite_tickets_comments SET ?', _data);
        await connection.query('UPDATE kwebsite_tickets SET status_id = 3 WHERE uid = ?', req.params.uid)
    } catch (error) {
        console.log(error)
        return res.redirect('/admin/support')
    }
    res.redirect(`/admin/t/${req.params.uid}`)
});

app.post('/t/:uid/assign', async(req,res) => { //Assign ticket to staff member.
    if(!req.body){
        return res.redirect(`/admin/${req.params.uid}`);
    }
    try {
        console.log(req.body)
        const _assign = {
            assigned_to:req.body.staff_uuid,
            assigned_by:res.locals.bUser.uuid,
            disabled:0,
            uid:req.params.uid
        } 
        console.log(_assign)
        await connection.query('INSERT INTO kwebsite_tickets_assigned SET ?',_assign)
        res.redirect(`/admin/t/${req.params.uid}`);
    } catch (error) {
        console.log(error);
        return res.redirect('/admin/support');
    }

});

app.post('/t/:uid/close', async (req,res) => {
    if(!req.params.uid){
        return res.status(413).json({message:'Unauthorized.'});
    }
    try {
        await connection.query('UPDATE kwebsite_tickets SET status_id = 4, closed_by = ?, closed_date = ? WHERE uid = ?', [req.user.uuid,new Date().toISOString().replace('T',' ').slice(0,19),req.params.uid])
    } catch (error) {
        console.log(error);
        return res.redirect('/admin/support');
    }
    res.json({status:200,message:'Ticket Closed'})

});

module.exports = app;