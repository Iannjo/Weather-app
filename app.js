//jshint esversion :6

const express = require('express');
//const https = require('https');
const axios = require('axios').default;
const result = require('dotenv').config();

const path = require('path');
const { response } = require('express');

const app = express();

//using the variable to test return data from .env
if (result.error) {
  throw result.error
}

console.log(result.parsed) //Print out the results from the parsed file, good to test .env

console.log(path.join(__dirname)) // print out the document path 



// Static Files
app.use( express.static(path.join(__dirname, 'public')));

//Enable app to access form input data
app.use(express.urlencoded({extended: true}));



app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

//Work on it to get data from url
app.get("/weather",function(req,res){
  const { username } = req.query.cityName; // ?username=hai 
    res.json({ username }); // username is equal to 'hai'
    console.log(req.body);
})
app.get("/images",function(req,res){
  res.sendFile(__dirname + "/public/images/afro-lawyer2.jpg");
});


app.post("/", function(req, res) {
 
  console.log(req.body.cityName);

  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const units = "metric";
  const endPoint = "https://api.openweathermap.org/data/2.5/weather?q=";
  
  

  const url = endPoint + query + "&appid=" + apiKey + "&units=" + units;

  //Using the express https method to access external html
  // https.get(url, function(response) {
  //   // console.log(response)

  //   response.on('data', function(data) {
      
  //     const weatherData = JSON.parse(data);
  //     console.log(weatherData.weather[0].description);

  //     const temp = weatherData.main.temp; //The main and temp from the JSON
  //     const place = weatherData.name;

  //     const description = weatherData.weather[0].description;
  //     const icon = weatherData.weather[0].icon;
  //     const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      

  //     console.log(temp, place, description);

  //  res.write("<h1>The current temparature in <span>" + place + "</span> is " + temp + " degrees celicus</h1>");
  //     res.write("<p>The weather is currently " + description + "</p>");
  //     res.write("<img src=" + imageUrl + ">");

  //     res.send();
  //   });
  // });


  // Try Axios

  axios.get(url)
    .then(response => {
      console.log(response.data.weather);
      const feels_like = response.data.main.feels_like;
      const temp = response.data.main.temp;
      const place = response.data.name;
      const description = response.data.weather[0].description;
      const icon = response.data.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@4x.png";

      res.write("<h1>The current temparature in <span>" + place + "</span> is " + temp + " degrees celicus</h1>");
      res.write("<h2>feels like: " + feels_like + "</h2>");
      res.write("<p>The weather is currently " + description + "</p>");
      res.write("<img src=" + imageUrl + ">");
      res.write("<a href=/>Home</a>")
      res.send();
    })
    .catch(error => {
      console.log(error.response.statusText);
      res.write("<h1>" + error.response.statusText +"</h1>")
    })
    //Always gets executed with or without errors h
    .then(function(){
      console.log("Always gets executed without a hitch");
      
    })
      

  });


app.listen(process.env.PORT || 3000, function() {
  console.info("Sever runing on port: " + process.env.PORT || port);
});