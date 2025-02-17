const express = require('express');
const path = require('path');
const axios = require('axios');
const moment = require('moment');
const { parse } = require('node-html-parser');
const cors = require('cors');
const app = express();
require("dotenv").config();

app.use(cors());

app.use(express.static(__dirname + "/public/"));


app.get('/api/news', (req, res) => {
   axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
           sources: 'techcrunch',
           apiKey: process.env.NEWS_API_KEY,
           sortBy: 'publishedAt',
           language: 'en'
        }
    })
    .then(response => {
        const data = response.data.articles.map(article => {
          return {
             ...article,
             parsedArticleDescription: parse(article.description).textContent,
             publishDate: moment(article.published_at).format('MM/DD/YYYY h:mm A')
          };
        });
        res.json(data);
    });
});

app.get('/api/weather', (req, res) => {
    axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            lat: req.query.latitude,
            lon: req.query.longitude,
            appid: process.env.WEATHER_API_KEY,
            units: 'imperial'
        }
    })
    .then(response => {
       res.json(response.data);
    });
});

const start = () => {
  try {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
module.exports = app;
