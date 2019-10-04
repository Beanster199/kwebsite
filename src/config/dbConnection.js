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
    database: 'ksystem',
    typeCast: function castField( field, useDefaultTypeCasting ) {

        // We only want to cast bit fields that have a single-bit in them. If the field
        // has more than one bit, then we cannot assume it is supposed to be a Boolean.
        if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

            var bytes = field.buffer();

            // A Buffer in Node represents a collection of 8-bit unsigned integers.
            // Therefore, our single "bit field" comes back as the bits '0000 0001',
            // which is equivalent to the number 1.
            return( bytes[ 0 ] === 1 );

        }

        return( useDefaultTypeCasting() );

    }
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