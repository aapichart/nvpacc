const router = require("express").Router();
const path = require('path');
const {execSimpleQuery} = require('../Model/user');
const {login} = require('../Controller/userController');
const jwt = require('jsonwebtoken');

// Read secretKey from .env
const secretKey = process.env.SECRET_KEY; 

// logger - middleware
// Solve problem of req.body is empty object {}, due to form-data (post)
let logger = require("morgan");
const bodyParser = require("body-parser");
router.use(logger('dev'));

// middlware prevent from cors security
const cors = require('cors');
router.use(cors());

// middleware
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get("/", (req, res, next) => {
  res.send('<h1> This is the main web API Page </h1>');
  <!--  res.sendFile(path.join(__dirname,'../../public', "homeVue.html"),{dotfiles: "allow"}); -->
  next();
});

router.get("/user/:id", (req, res, next) => {
//  execSimpleQuery('select fullname, username, password from users where username = $1::text',['chart.asa']).then((result) => {
  var numid = req.params.id;
  execSimpleQuery('select fullname, username, password from users where id = $1',[numid]).then((result) => {
    console.log(result);
    res.send(result);
  }).catch((err) => {
    console.log(err)
  })
});

router.post("/user/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Profile created....',
        authData
      })
    }
  });
});
//
// This function is used for verified every route
// format token => Authorization: Bearer <access_token>
//
function verifyToken(req, res, next){
// Put token into Auth Data Header
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    // Split token from bearer
    const bearer = bearerHeader.split(' ');
    // get the token
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    console.log(bearerToken);
    //
    next();
  } else {
    res.sendStatus(403);
  }
};

//
// Using this login to gen jwt token and insert it into req.headers for verifying at protected route
//
router.post("/user/login", async (req, res, next) => {
  try {
    const {username, password} = req.body;
    // we need to pass data in json format into req.body by using header "Content-Type=application/json" This can test by postman option
    let result = await login(username, password);
    // If come to this point, it supposed that user is already logged in 
    // Then, we will create a token for him
    // Suppose the mockup user is here
    const user = {
      id: result.id,
      username: result.username 
    }
    // result = {
    //   message: 'xxxxxxxx',
    //   id: 3,
    //   username: 'yyyy',
    //   token: ''
    // }
    if (result.id > 0){
        jwt.sign({user:user}, secretKey,(err, token) => {
          if (err) {
            res.sendStatus(403);
          } else {
            result.token = token;
            res.json(result)
            console.log(result);
          }
        })
    } else {
      console.log(result);
      res.json(result);
    }
//    return res.redirect('http://10.135.70.65/apichart/AM_Master_All_2020');
    //        return res.send(result);
  } catch(err) {
    return console.log(err)
  };
   next();
});

module.exports = router;


