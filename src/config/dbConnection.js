const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const raw = fs.readFileSync(path.join(__dirname, 'sam.json'), 'utf8');
const raw_json = JSON.parse(raw);

const pool = mysql.createPool({
    host: raw_json.host,
    port: 3306,
    user: raw_json.user,
    password: raw_json.password,
    database: 'ksystem'
});

pool.getConnection((err, connection) => {
   if (err) {
       if (err.code === 'PROTOCOL_CONNECTION_LOST'){
           console.error('[!] DATABASE CONNECTION WAS CLOSED')
       }
       if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('[!] DATABASE HAS TO MANY CONNECTIONS');
       }
       if (err.code === 'ECONNREFUSED') {
            console.error('[!] DATABASE CONNECTION WAS REFUSED')
       }
       if (err.code === 'ETIMEDOUT') {
           console.error('[!] DATABASE CONNECTION TIMEOUT')
       }
       console.log(err)
   } 
   if (connection) {connection.release();
   console.log('[-] DB Connected.') }
   return;
});

pool.query = promisify(pool.query)
module.exports = pool;