// db.ts
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

let connection: mysql.Pool;

declare global {
  var _connection: mysql.Pool | undefined;
}

if (!global._connection) {
  global._connection = mysql.createPool({
    uri: process.env.JAWSDB_URL || "mysql://kqydyq0eznrb573j:c4ums7k6uohxb5ua@q68u8b2buodpme2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/a8ii54ul8zyr1yt1", // Use your connection string from config vars
    connectionLimit: 5,          // Adjusted connection limit
  });
}

connection = global._connection;

export default connection;
