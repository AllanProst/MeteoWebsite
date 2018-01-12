////////////////////////////////////////////////////////////////////////
///***---PACKAGES---***\\\

var express = require("express");
var request = require("request");
var app = express();
var mongoose = require("mongoose");
var cityList = [];
var options = { server: { socketOptions: { connectTimeoutMS: 30000 } } };

app.set("view engine", "ejs");
app.use(express.static("public"));

var apiKey = "c14d8ef5041006e5294cbd0645da5611";
var villesHome = ["Paris", "Tokyo", "Berlin"];

var villeSchema = mongoose.Schema({
  name: String,
  iconemeteo: String,
  desc: String,
  tempmax: String,
  tempmin: String,
  position: Number,
  lat: String,
  lng: String
});
var VilleModel = mongoose.model("villes", villeSchema);

mongoose.connect(
  "mongodb://weatherapp:admin@ds055822.mlab.com:55822/weatherapp",
  options,
  function(err) {
    console.log(err);
  }
);

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
///***---ROUTES---***\\\
/// Boucle qui récupère les 3 villes en Home Page

// for (var i = 0; i < villesHome.length; i++) {
//   request(
//     "http://api.openweathermap.org/data/2.5/weather?q=" +
//       villesHome[i] +
//       "&lang=fr&units=metric&appid=c14d8ef5041006e5294cbd0645da5611",
//     function(error, response, body) {
//       var body = JSON.parse(body);
//       var newCityHome = {
//         name: body.name,
//         iconemeteo:
//           "http://openweathermap.org/img/w/" + body.weather[0].icon + ".png",
//         desc: body.weather[0].description,
//         tempmax: body.main.temp_max + "°C",
//         tempmin: body.main.temp_max + "°C"
//       };
//       cityList.push(newCityHome);
//     }
//   );
// }

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
app.get("/move", function(req, res) {
  console.log(req.query.newposition);
  var neworder = JSON.parse(req.query.newposition);
  var query = VilleModel.find();
  query.sort({position : 1})
  query.exec(function(err, cities) {
    for (var i = 0; i < cities.length; i++) {
      cities[neworder[i]].set({ position: i });
      cities[neworder[i]].save(function(error, ville) {
      });
    }
  });
  var query = VilleModel.find();
  query.sort({position : 1})
  query.exec(function(err, cities) {
    res.render("meteo", { cityList: cities });
  });
});

  ///var query = villeModel.find();
  // query.sort({position : 1})
  // query.exec(function(err, cities) {
  //   res.render("meteo", { cityList: cities });
  // });
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

app.get("/", function(req, res) {
  var query = VilleModel.find();
  query.sort({position : 1});
  query.exec(function(err, cities) {
    res.render("meteo", { cityList: cities });
  });
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
app.get("/suppr", function(req, res) {
  VilleModel.remove({ _id: req.query.id }, function(error) {

    VilleModel.find(function(err, cities) {
      for (var i=0; i<cities.length; i++){
        cities[i].set({position: i});
        cities[i].save(function(error, ville) {});
      }
      res.render("meteo", { cityList : cities });
    });

  });
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
          var newCity = new VilleModel({
            name: req.query.nameVille,
            iconemeteo:
              "http://openweathermap.org/img/w/" +
              body.weather[0].icon +
              ".png",
            desc: body.weather[0].description,
            tempmax: body.main.temp_max + "°C",
            tempmin: body.main.temp_max + "°C",
            position: 0,
            lat: body.coord.lat,
            lng: body.coord.lon
          });
          cityList.push(newCity);
          newCity.save(function(error, ville) {
            ///on peut mettre une fonction de call-back ici
            VilleModel.find(function(err, cities) {
              for (var i=0; i<cities.length; i++){
                cities[i].set({position: i});
                cities[i].save(function(error, ville) {});
              }
              res.render("meteo", { cityList : cities });
            });
          });
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
