const express = require('express');
const app = express.Router();
const connection = require('../../config/dbConnection');

app.get('/:nameId', async (req, res) => {
    const con = req.connection.remoteAddress
    console.log(con)
    if (req.params.nameId) {
        const query = 'SELECT uuid_long,kwe_lastlogin as lastlogin,kwe_name as name FROM kwebsite_users where kwe_name = "Benster_199"';
        let profile = await connection.query(query)
        if (profile.length = 0){
            return;
        } 
        profile[0].views = await Counter(profile)
            if (profile.length > 0) {
                console.log(profile)
                console.log(profile[0].lastlogin)
                res.render('../views/u/user_profile.hbs' , {
                    user: profile
                  }
                )
            } 
//            else {
//                res.render('status/user_404', {
//                    error: req.params.nameId
//               });
//        };
//        return console.log(req.params.nameId);
    } else {
        res.redirect('/')
    }
});

async function Counter(profile){
    const uuid = profile[0].uuid_long;
    const views = await connection.query('select count(kuv_uuid) as count from kwebsite_users_views WHERE kuv_uuid ="' + uuid + '"')
//    const today = await connection.query('select count(kuv_uuid) as uuid where kwebsite_users_views WHERE kuv_ip= and k')
    console.log(views)
    return views[0].count;
}

module.exports = app