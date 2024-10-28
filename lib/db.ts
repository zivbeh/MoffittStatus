import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

/* eslint-disable no-var */
declare global {
  var _connection: mysql.Pool | undefined;
}
/* eslint-enable no-var */

const connection: mysql.Pool = global._connection || mysql.createPool({
  uri: process.env.JAWSDB_URL ,
  connectionLimit: 12,
});

global._connection = connection;

export default connection;
