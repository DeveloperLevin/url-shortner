require('dotenv').config()
const mysql = require('mysql2')
const { v4: uuidv4 } = require('uuid');

// create connection
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME
})

// connect to database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to MySQL Database!');
})

// function to check if table exists or not
function checkTableExists() {
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS url_shortner (
        id INT PRIMARY KEY,
        longUrl VARCHAR(255) NOT NULL,
        shortUrl VARCHAR(255) NOT NULL
    )
    `

    connection.query(createTableSql, (err) => {
        if (err){
            return callback(err);
        }
    })

    connection.close();
}

// function to add new data
function checkAndAddData (longUrl, shortUrl=null){
    const checkPrompt = `SELECT * FROM url_table WHERE longUrl = ?`;
    connection.query(checkPrompt, [longUrl], (err, results) => {
        if (err) {
            return callback(err);
        }

        // no data exists, add the data to the database
        if (results.length === 0){
            const uniqueId = uuidv4();
            const addPrompt = `INSERT INTO url_table (id, longUrl, shortUrl) VALUES (?, ?, ?)`;
            
            connection.query(addPrompt, [uniqueId, longUrl, shortUrl], (err) => {
              if (err) {
                return callback(err);
              }  
              callback(null, null);
            })
        }
        else {
            callback(null, results);
        }
    })

    // close connection after appending to the database
    connection.close();
}

module.exports = {
    checkAndAddData,
    checkTableExists
}