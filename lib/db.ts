import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

// Extending the global type to include _connection
declare global {
  // Add _connection property to globalThis
  var _connection: mysql.Pool | undefined;
}

let connection: mysql.Pool;

if (!global._connection) {
  global._connection = mysql.createPool({
    uri: process.env.JAWSDB_URL || "mysql://kqydyq0eznrb573j:c4ums7k6uohxb5ua@q68u8b2buodpme2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/a8ii54ul8zyr1yt1", // Use your connection string from config vars
    connectionLimit: 1000,          // Adjusted connection limit
  });
}

connection = global._connection;

export default connection;
