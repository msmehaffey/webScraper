var express = require("express");
var mongoose = require('mongoose');
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();
var router = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mlbTradeRumors";

mongoose.connect(MONGODB_URI);
// Connect to the Mongo DB




require("./routes/router")(app,axios,cheerio,db);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});