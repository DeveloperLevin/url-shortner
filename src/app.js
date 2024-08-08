require('dotenv').config()

// imports
const { checkAndAddData, checkTableExists, checkData } = require('../models/model');
const db = require('../models/model'); 
const express = require('express');

// create server 
const app = express()
const port = process.env.PORT;

// middlewares
app.use(express.urlencoded({ extended: true, limit: '1mb'}));
app.use(express.static('public'))

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Initialize database
checkTableExists()

// routes
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    const { longUrl } = req.body;

    //code to generate hash value and append to the array

    // append to database
    checkAndAddData(longUrl)
    .then(data => {
        if (data) {
            res.render('index', {shortUrl: data})
        }
        else {
            res.status(404).send('No data found or added');
        }
    })
    .catch(err => {
        console.log("Error: ", err)
        res.status(500).send('Server response timed out')
    })
})

app.get('/shortner/:hashValue', (req, res) => {
    const hashValue = req.params.hashValue;
    const shortUrl = `https://localhost:3000/shortner/` + hashValue;

    // get the longUrl for the respective short url and redirect to that website
    checkData(shortUrl)
    .then((longUrl) => {
        if (longUrl) {
            res.redirect(longUrl);
        }
    })
    .catch(err => {
        console.log("Error: ", err)
        res.status(500).send('Server response timed out')
    })
})

// Listen to Server
app.listen(port, () => {
    console.log("Listening to Server");
})