const bcrypt = require('bcryptjs')
const helpers = {};

const moment = require('moment');

helpers.getServerDateTime = async () => {
    return await moment().format('YYYY-MM-DD HH:mm:ss');
}

helpers.registerPassword = async (password) => {
    const salt = await bcrypt.genSalt(15);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.loginPassword = async (password, savedPassword) => {
    return await bcrypt.compare(password, savedPassword);
}

module.exports = helpers;