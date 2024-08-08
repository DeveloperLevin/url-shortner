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
}

// function to check the long url and rediect to the website
function checkData(shortUrl) {
    const checkPrompt = 'SELECT * FROM url_shortner WHERE shortUrl = ?';

    return new Promise((resolve, reject) => {
        connection.query(checkPrompt, [shortUrl], (err, result) => {
            if (err) {
                console.log('Error:', err);
                return reject(err);
            }

            if (result.length > 0) {
                resolve(result[0].longUrl);
            } else {
                resolve(null); // Or you can resolve with a different value to indicate not found
            }
        });
        
        // close database connection
        connection.close();

    });
}

// function to add data if no short url for the original url exists
function checkAndAddData(longUrl, shortUrl = null) {
    const checkPrompt = 'SELECT * FROM url_shortner WHERE longUrl = ?';

    return new Promise((resolve, reject) => {
        connection.query(checkPrompt, [longUrl], (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.length === 0) {
                // No data exists, add the data to the database
                const uniqueId = uuidv4();
                const addPrompt = 'INSERT INTO url_shortner (id, longUrl, shortUrl) VALUES (?, ?, ?)';

                connection.query(addPrompt, [uniqueId, longUrl, shortUrl], (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(shortUrl); // Data added successfully
                });
            } else {
                resolve(results[0].shortUrl); // Data already exists
            }
        });

        // close database connection
        connection.close()

    });
}


module.exports = {
    checkData,
    checkAndAddData,
    checkTableExists
}