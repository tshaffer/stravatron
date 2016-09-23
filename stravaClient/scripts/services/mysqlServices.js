/**
 * Created by tedshaffer on 9/23/16.
 */
var mysql      = require('mysql');

export function initDB() {

    console.log('create mysql connection');

    // var dbHostName = '127.0.0.1';
    let dbHostName = 'localhost';

    let connection = mysql.createConnection({
        host: dbHostName,
        //user: 'ted',
        //password: 'ted69',
        user: 'root',
        password: 'strava69',
        database: 'stravatron'
    });

    console.log("connect");

    connection.connect();

    console.log("invoked connect");
    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;

        console.log('The solution is: ', rows[0].solution);
    });

    connection.end();
}


