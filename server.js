///PACKAGES
var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
var request = require("request");
var apiKey = "c14d8ef5041006e5294cbd0645da5611";

var cityList = [
  {
    name: "Paris",
    iconemeteo: "http://openweathermap.org/img/w/01d.png",
    desc: "nuageux",
    tempmax: "26 °C",
    tempmin: "17 °C"
  },
  {
    name: "Lyon",
    iconemeteo: "http://openweathermap.org/img/w/02d.png",
    desc: "soleil",
    tempmax: "12 °C",
    tempmin: "5 °C"
  },
  {
    name: "Marseille",
    iconemeteo: "http://openweathermap.org/img/w/01d.png",
    desc: "grand soleil",
    tempmax: "7 °C",
    tempmin: "50 °C"
  }
];

///ROUTES

app.get("/", function(req, res) {
  res.render("meteo", { cityList: cityList });
});

app.get("/add", function(req, res) {
  if (
    req.query.nameVille &&
    req.query.nameVille != "" &&
    req.query.nameVille != " "
  )
    request(
      "http://api.openweathermap.org/data/2.5/weather?q=" +
        req.query.nameVille +
        ",fr&lang=fr&units=metric&appid=" +
        apiKey,
      function(error, response, body) {
        var body = JSON.parse(body);
        {
          var newCity = {
            name: req.query.nameVille,
            iconemeteo: "http://openweathermap.org/img/w/"+body.weather[0].icon+".png",
            desc: body.weather[0].description,
            tempmax: body.main.temp_max +"°C",
            tempmin: body.main.temp_max +"°C"
          };
          cityList.push(newCity);
          res.render("meteo", { cityList: cityList });
        }
      }
    );
});

app.get("/suppr", function(req, res) {
  cityList.splice(req.query.indice, 1);
  res.render("meteo", { cityList: cityList });
});

///LISTEN
var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Meteo Online");
});
