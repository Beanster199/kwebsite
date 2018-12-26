const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (datetime) => {
    console.log(datetime);
    return format(datetime);
}

module.exports = helpers;