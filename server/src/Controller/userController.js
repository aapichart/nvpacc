const {execSimpleQuery} = require('../Model/user');
const crypto = require('crypto');
const env = require('../config/.env');

const saltkey = process.env.SALT;
const cipherSeed = process.env.CIPHER_SEED;

let login = async function (inusername, inpassword){
    try {
        let result = await execSimpleQuery('select id, username, password from users where username = $1::text',[inusername])
        if (result.status == 'Ok') {
          const {status, message, data} = result;
          const {id, username, password} = data[0];
          let passedAuthen = passedAuth(result, inpassword);
          if (passedAuthen) {
            let outsolution = {
              message: 'Authenticated Success.',
              id: id,
              username: username,
              token: ''
            }
            return outsolution;
          } else {
            let outsolution = {
              message: 'Authenticated Failed - Wrong Password!!..',
              id: -1,
              username: username,
              token: ''
            }
            return outsolution;
          }
        }else{
          let outsolution = {
            message: 'Do not have this username!!!..',
            id: 0,
            username: inusername,
            token: ''
          }
          return outsolution;
        }
    }catch(err){ 
        console.log(err);
    }
}

var hash_sha1 = function(inpassword, saltkey){
    inpassword = saltkey + inpassword;
    var hash = crypto.createHash('sha1');
    hash.update(inpassword);
    var value = hash.digest('hex');
    return value;
}

let passedAuth = function (loginData, inpassword){
    const {status, message, data} = loginData;
    const {id, username, password}  = data[0];
    var hash_pass = hash_sha1(inpassword, saltkey);
    // console.log(password);
    // console.log(hash_pass);
    if (hash_pass === password){
      return true;
    } else {
      return false;
    }
}


module.exports = {
  login
}
