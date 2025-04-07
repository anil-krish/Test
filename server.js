const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(express.static('public'));
const fetch = require('node-fetch');
app.set('view engine', 'ejs');
const details = require('country-state-city');


app.use(bodyParser.urlencoded({extended:true}));
app.get('/', (req, res) => {
    const sendData = {location: 'Location', country:"", temp:'temp', disc:'Description', feel:'Feel-Like', humidity:'Humidity', speed:'Speed'};
    res.render('index', {sendData:sendData});
});

app.get('/api/countries', (req, res) => {
    const countries = details.Country.getAllCountries();
    //console.log(countries);
    res.json(countries);
});
app.get('/api/states', (req, res) => {
    const countryCode = req.query.countryCode;
    const states = details.State.getStatesOfCountry(countryCode);
    console.log(countryCode);
    console.log(states);
    res.json(states);
});
app.get('/api/cities', (req, res) => {
    const countryCode = req.query.countryCode;
    const stateCode = req.query.stateCode;
    const cities = details.City.getCitiesOfState(countryCode, stateCode);
    console.log(stateCode);
    console.log(cities);
    res.json(cities);
});

app.post('/', async (req, res) => {
    let location = await req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
    const response = await fetch(url);
    const weatherData = await response.json();
    const temp = Math.floor(weatherData.main.temp);
    const disc = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const imgurl = `<img src='https://openweathermap.org/img/wn/${icon}@2x.png'>`;
    //res.write(`<h1>Current Weather in ${location} is ${disc}</h1>`);
    //res.write(`<h1>The Current Temperature is ${temp} degree celcius.</h1>`);
    //res.write(`<img src='${imgurl}'>`);
    const sendData = {};
    sendData.temp=temp;
    sendData.disc = disc;
    sendData.location = location;
    sendData.imgurl = imgurl;
    sendData.country = weatherData.sys.country;
    console.log(weatherData);
    res.render('index', {sendData: sendData});
    //res.send('Thank You');
    //res.end();
});
app.listen(8000, () => {
        console.log('Server is Running att "http://localhost:8000...........');
});