const mysql = require('mysql');

export default class DBServices {


    constructor() {
        this.dbHostName = 'localhost';
    }


    initialize() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.dbConnection = mysql.createConnection({
                host: self.dbHostName,
                user: 'ted',
                password: 'hello69',
                database: 'stravatron'
            });

            self.dbConnection.connect();

            let reason = {};
            let promises = [];
            let createAthletesPromise = self.createAthletesTable();
            let createSelectedAthletePromise = self.createSelectedAthleteTable();
            let createMapsPromise = self.createMapsTable();
            Promise.all([createAthletesPromise, createSelectedAthletePromise, createMapsPromise]).then(value => {
                resolve(self.dbConnection);
            }, reason => {
                reject(reason);
            });
        });
    }

    createAthletesTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.dbConnection.query(
                "CREATE TABLE IF NOT EXISTS athletes ("
                + "stravaAthleteId VARCHAR(32) NOT NULL, "
                + "accessToken VARCHAR(64) NOT NULL,"
                + "name VARCHAR(32) NOT NULL, "
                + "firstname VARCHAR(32) NOT NULL, "
                + "lastname VARCHAR(32) NOT NULL, "
                + "email VARCHAR(64) NOT NULL, "
                + "PRIMARY KEY(stravaAthleteId))",
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    console.log("create athletes successful");
                    resolve();
                }
            );
        });
    }

    addAthlete(stravaAthleteId, accessToken, name, firstname, lastname, email) {
        return new Promise( (resolve, reject) => {
            this.dbConnection.query(
                "INSERT INTO athletes (stravaAthleteId, accessToken, name, firstname, lastname, email) " +
                " VALUES (?, ?, ?, ?, ?, ?)",
                [stravaAthleteId, accessToken, name, firstname, lastname, email],
                (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    console.log("added athlete successfully:", name);
                    resolve();
                }
            );
        });
    }

    getAthletes() {
        return new Promise( (resolve, reject) => {
            var query = "SELECT * FROM athletes";
            this.dbConnection.query(
                query,
                function (err, rows) {
                    if (err) {
                        reject(err);
                    }

                    console.log("return from athletes query - rows length = " + rows.length);

                    if (rows.length == 0) {
                        console.log("no athletes found");
                        resolve([]);
                    }
                    else {
                        let athletes = [];
                        rows.forEach( row => {
                            // console.log("found athlete");
                            // console.log(row);
                            let athlete = {
                                stravaAthleteId: row.stravaAthleteId,
                                accessToken: row.accessToken,
                                name: row.name,
                                firstname: row.firstname,
                                lastname: row.lastname,
                                email: row.email
                            };
                            athletes.push(athlete);
                        });
                        resolve(athletes);
                    }
                });
        });
    }

    createSelectedAthleteTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.dbConnection.query(
                "CREATE TABLE IF NOT EXISTS selectedAthlete ("
                + "stravaAthleteId VARCHAR(32) NOT NULL)",
                (err) => {
                    if (err) {
                        reject(err);
                    }

                    console.log("create createSelectedAthleteTable successful");

                    resolve();
                    // don't add to the table unless none exist - figure out how to do this.
                    // self.dbConnection.query(
                    // "INSERT INTO selectedAthlete (stravaAthleteId) " +
                    // " VALUES (?)",
                    //     ["2843574"],
                    //     (err) => {
                    //         if (err) {
                    //             console.log(err);
                    //             reject(err);
                    //         }
                    //         console.log("added athlete successfully:", name);
                    //         resolve();
                    //     });
                });
        });
    }

    getSelectedAthlete() {
        return new Promise( (resolve, reject) => {
            var query = "SELECT * FROM athletes JOIN (selectedAthlete) ON (athletes.stravaAthleteId = selectedAthlete.stravaAthleteId)";
            this.dbConnection.query(
                query,
                function (err, rows) {
                    if (err) {
                        reject(err);
                    }

                    console.log("return from getSelectedAthlete query - rows length = " + rows.length);

                    if (rows.length == 0) {
                        console.log("no athletes found");
                        resolve([]);
                    }
                    else {
                        let selectedAthlete = {
                            stravaAthleteId: rows[0].stravaAthleteId,
                            accessToken: rows[0].accessToken,
                            name: rows[0].name,
                            firstname: rows[0].firstname,
                            lastname: rows[0].lastname,
                            email: rows[0].email
                        };
                        resolve(selectedAthlete);
                    }
                });
        });
    }

    // https://www.npmjs.com/package/mysql
    setSelectedAthlete(stravaAthleteId) {
        return new Promise( (resolve, reject) => {
            this.dbConnection.query(
                "UPDATE selectedAthlete SET stravaAthleteId =  (stravaAthleteId) " +
                " VALUES (?)",
                [stravaAthleteId],
                (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    console.log("added athlete successfully:", name);
                    resolve();
                }
            );
        });
    }

    createMapsTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.dbConnection.query(
                "CREATE TABLE IF NOT EXISTS maps ("
                + "id MEDIUMINT NOT NULL AUTO_INCREMENT,"
                + "name VARCHAR(64) NOT NULL,"
                + "stravaStyle VARCHAR(64) NOT NULL, "
                + "PRIMARY KEY(id))",
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    console.log("create maps successful");
                    resolve();
                }
            );
        });
    }

    addMap(name, stravaStyle) {
        return new Promise( (resolve, reject) => {
            this.dbConnection.query(
                "INSERT INTO maps (name, stravaStyle) " +
                " VALUES (?, ?)",
                [name, stravaStyle],
                (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    console.log("added map successfully:", name);
                    resolve();
                }
            );
        });
    }


}