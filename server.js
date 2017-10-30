///PACKAGES
var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
var request = require('request');


///ROUTES

app.get("/", function(req, res) {
  res.render("meteo");
});




///LISTEN
var port = (process.env.PORT || 8080);

app.listen(port, function() {
  console.log("Meteo Online");
});
