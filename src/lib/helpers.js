const bcrypt = require('bcryptjs')
const helpers = {};
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();

const moment = require('moment');

helpers.getServerDateTime = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

helpers.registerPassword = async (password) => {
    const salt = await bcrypt.genSalt(15);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.UUID = (len = 36) => {
    return uid.randomUUID(len)
};

helpers.loginPassword = async (password, savedPassword) => {
    return await bcrypt.compare(password, savedPassword);
}

module.exports = helpers;