const moment = require('moment');
const { format } = require('timeago.js');
const connection = require('../config/dbConnection');

const helpers = {};

helpers.timeago = (datetime) => {
    return format(datetime);
};

helpers.to_datetime = (datetime) => {
    return moment(parseInt(datetime)).format('MMM. Do YYYY HH:mm a');
};

helpers.StringToDatetime = (datetime) => {
    console.log(datetime)
    return moment(datetime).format('MMM. Do YYYY HH:mm a');
};

helpers.playtime = (seconds) => {
    let days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    let hrs   = Math.floor(seconds / 3600);
    seconds  -= hrs*3600;
    let mnts = Math.floor(seconds / 60);
    seconds  -= mnts*60;
    return `${days} days, ${hrs} hours, ${mnts} min.`
};

module.exports = helpers;