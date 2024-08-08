require('dotenv').config()

// imports
const { checkAndAddData, checkTableExists } = require('../models/model');
const db = require('../models/model'); 
const express = require('express');

// create server 
const app = express()
const host = process.env.HOST;
const port = process.env.PORT;

// middlewares
app.use(express.urlencoded({ extended: true, limit: '1mb'}));
app.use(express.static('public'))

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    const { longUrl } = req.body;
})

app.get('/shortner/:hashValue', (req, res) => {
    const hashValue = req.params.hashValue;
    const shortUrl = `https://localhost:3000/shortner/` + hashValue;
})

// Listen to Server
app.listen(host, port, () => {
    console.log("Listening to Server");
})

// // handle submit button
// const submit = document.querySelector('.submit');
// submit.addEventListener('click', (e) => {
//     e.preventDefault()
//     const userId = uuidv4();
//     const longUrl = document.querySelector('.long-url').value;

//     // code to generate shortUrl and append to database
    
//     // append value to the database
// })
