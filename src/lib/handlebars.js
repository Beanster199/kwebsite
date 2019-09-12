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

helpers.StringToDatetime = (datetime) => {
    return moment(datetime).format('MMM. Do YYYY HH:mm a');
}

module.exports = helpers;