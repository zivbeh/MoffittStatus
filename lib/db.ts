import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

declare global {
  var _connection: mysql.Pool | undefined;
}

const connection: mysql.Pool = global._connection || mysql.createPool({
  uri: process.env.JAWSDB_URL || "mysql://kqydyq0eznrb573j:c4ums7k6uohxb5ua@q68u8b2buodpme2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/a8ii54ul8zyr1yt1",
  connectionLimit: 500,
});

global._connection = connection;

export default connection;
