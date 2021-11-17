const {Pool, Client} = require('pg');
const env = require("dotenv").config({ path: "./src/config/.env" }).parsed;
var username = process.env.PGUSER;
var passd = process.env.PGPASSWORD;
var host = process.env.PGHOST;
var port = process.env.PGPORT;
var database = process.env.PGDATABASE;
var maxclient = 40;
var idletime = 30000;
var connecttimeout = 2000;
var pgUri = '';

config = {
      host: host,
      user: username,
      database: database,
      password: passd,
      port: port,
      max: maxclient,
      idleTimeoutMillis: idletime,
      connectionTimeoutMillis: connecttimeout 
}

console.log(`username: ${username}`);
console.log(`host: ${host}, port: ${port}, database: ${database}`);
console.log(`max: ${maxclient}, idletime: ${idletime}, connectionTimeout: ${connecttimeout}`);
module.exports = {
  config 
}

