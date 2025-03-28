const Pool = require('pg').Pool;
const ENV = require('../config');

const dbConfig = {
  user: ENV.DB_USER,
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  database: ENV.DB_DATABASE,
  password: ENV.DB_PASSWORD,
}

const db = new Pool(dbConfig);

module.exports = db;