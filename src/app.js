// imports
const { checkAndAddData, checkTableExists } = require('../models/model');
const db = require('../models/model'); 

// handle submit button
const submit = document.querySelector('.submit');
submit.addEventListener('click', (e) => {
    e.preventDefault()
    const userId = uuidv4();
    const longUrl = document.querySelector('.long-url').value;

    // code to generate shortUrl and append to database
    
    // append value to the database
})
