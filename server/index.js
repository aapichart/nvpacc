const express = require("express");
const path = require("path");
const env = require("dotenv").config({ path: "./src/config/.env" }).parsed;
const bodyParser = require('body-parser');
const port = process.env.PORT;

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// Insert routing index.js
app.use(require('./src/Route/routeIndex.js'));

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
