const {Client, Pool} = require('pg');
const config = require('../config/dbconfig.js')
const pool = require('../config/dbconfig.js')
// This function is used for execute query as you wish.
// executeQuery('select * from account_codes');
//const result = execSimpleQuery("select * from account_codes", '');
//

// This function return promise => execSimpleQuery(sqlStr, sqlParam);
function execSimpleQuery(sqlStr, sqlParam) {
  return new Promise((resolve , reject) => {
  const pool = new Pool(config); 
  pool.connect((err, client, release) => {
    if (err) {
      reject('Error Acquiring Client');
    }
    client.query(sqlStr,sqlParam,(err, result) => {
      release()
      if (err) {
        reject('Error Executing Query');
      }
      if (result !== undefined) {
          if (result.rowCount > 0) {
            let resultset = result.rows;
            let outputmsg = {
              status: "Ok",  
              message: "Query Success",
              data: resultset
            }
            resolve(outputmsg);
          } else {
            let resultset = result.rows;
            let outputmsg = {
              status: "Null",
              message: "Query Success",
              data: resultset
            }
            resolve(outputmsg);
          }
      }
    })
  })
 })   
}; 
// ---------------------------------------------------

module.exports={
  execSimpleQuery
}


