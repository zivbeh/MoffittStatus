// lib/db.ts
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
    uri: process.env.JAWSDB_URL || "mysql://kqydyq0eznrb573j:c4ums7k6uohxb5ua@q68u8b2buodpme2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/a8ii54ul8zyr1yt1", // Use your connection string from config vars
    connectionLimit: 1000,
});

export default connection;