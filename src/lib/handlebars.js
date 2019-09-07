const moment = require('moment');
const { format } = require('timeago.js');
const connection = require('../config/dbConnection');

const helpers = {};

helpers.timeago = (datetime) => {
    return format(datetime);
}

helpers.to_datetime = (datetime) => {
    return moment(parseInt(datetime)).format('MMM. Do YYYY HH:mm a');
}

helpers.username =  async (uuid) => {
    const _username = await connection.query('SELECT username FROM ksystem_playerdata WHERE uuid = ?', uuid)
    return _username[0].username
}


module.exports = helpers;