////////////////////////////////////////////////////////////////////////
///***---PACKAGES---***\\\
var express = require("express");
var request = require("request");
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
var apiKey = "c14d8ef5041006e5294cbd0645da5611";
var cityList = [];
var villesHome = ["Paris", "Tokyo", "Berlin"];
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
///***---ROUTES---***\\\
/// Boucle qui récupère les 3 villes en Home Page
for (var i = 0; i < villesHome.length; i++) {
  request(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      villesHome[i] +
      "&lang=fr&units=metric&appid=c14d8ef5041006e5294cbd0645da5611",
    function(error, response, body) {
      var body = JSON.parse(body);
      var newCityHome = {
        name: body.name,
        iconemeteo:
          "http://openweathermap.org/img/w/" + body.weather[0].icon + ".png",
        desc: body.weather[0].description,
        tempmax: body.main.temp_max + "°C",
        tempmin: body.main.temp_max + "°C"
      };
      cityList.push(newCityHome);
    }
  );
}
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
app.get("/move", function(req, res) {
  var neworder = JSON.parse(req.query.newposition);
  var newcityList = [];
  for (var i = 0; i < neworder.length; i++) {
    newcityList.push(cityList[neworder[i]]);
    console.log(newcityList);
  }
  cityList = newcityList;
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
app.get("/", function(req, res) {
  res.render("meteo", { cityList });
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
app.get("/suppr", function(req, res) {
  cityList.splice(req.query.indice, 1);
  res.render("meteo", { cityList });
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
///Requete qui récupère la ville recherché et l'ajoute à la liste
app.get("/add", function(req, res) {
  if (
    req.query.nameVille &&
    req.query.nameVille != "" &&
    req.query.nameVille != " "
  )
    request(
      "http://api.openweathermap.org/data/2.5/weather?q=" +
        req.query.nameVille +
        "&lang=fr&units=metric&appid=" +
        apiKey,
      function(error, response, body) {
        var body = JSON.parse(body);
        {
          var newCity = {
            name: req.query.nameVille,
            iconemeteo:
              "http://openweathermap.org/img/w/" +
              body.weather[0].icon +
              ".png",
            desc: body.weather[0].description,
            tempmax: body.main.temp_max + "°C",
            tempmin: body.main.temp_max + "°C"
          };
          cityList.push(newCity);
          res.render("meteo", { cityList });
        }
      }
    );
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
///***---LISTEN---***\\\
var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Meteo Online");
});
