const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (datetime) => {
    return format(datetime);
}


module.exports = helpers;