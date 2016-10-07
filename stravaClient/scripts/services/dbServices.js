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
            let createSummaryActivitiesTablePromise = self.createSummaryActivitiesTable();
            let createSelectedAthletePromise = self.createSelectedAthleteTable();
            let createMapsPromise = self.createMapsTable();
            Promise.all([createAthletesPromise, createSummaryActivitiesTablePromise, createSelectedAthletePromise, createMapsPromise]).then(value => {
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

    createSummaryActivitiesTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.dbConnection.query(
                "CREATE TABLE IF NOT EXISTS summaryactivities ("
                + "activityId VARCHAR(32) NOT NULL, "
                + "athleteId VARCHAR(32) NOT NULL, "
                + "name VARCHAR(64) NOT NULL, "
                + "distance FLOAT NOT NULL, "
                + "movingTime INT NOT NULL, "
                + "elapsedTime INT NOT NULL, "
                + "totalElevationGain INT NOT NULL, "
                + "startDateTime DATE NOT NULL, "
                + "averageSpeed FLOAT NOT NULL, "
                + "maxSpeed FLOAT NOT NULL, "
                + "startPointLatitude DOUBLE NOT NULL, "
                + "startPointLongitude DOUBLE NOT NULL, "
                + "mapSummaryPolyline TEXT NOT NULL, "
                + "PRIMARY KEY(activityId))",
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

    getSummaryActivities(athleteId) {

        console.log("getSummaryActivities invoked");

        var summaryActivities = {};

        var query = "SELECT * FROM summaryactivities " +
            "WHERE athleteId=?";

        this.dbConnection.query(
            query,
            [athleteId],
            (err, rows) => {

            }
        );
    }

    addSummaryActivity(activity) {

        const a = activity;

        return new Promise( (resolve, reject) => {
            const startDate = new Date(a.startDateLocal);
            this.dbConnection.query(
                "INSERT INTO summaryactivities (activityId, athleteId, name, distance, movingTime, elapsedTime, totalElevationGain, startDateTime," +
                "averageSpeed, maxSpeed, startPointLatitude, startPointLongitude, mapSummaryPolyline) " +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [a.id, a.athleteId, a.name, a.distance, a.movingTime, a.elapsedTime, a.totalElevationGain, startDate,
                    a.averageSpeed, a.maxSpeed, a.startLatitude, a.startLongitude, a.mapSummaryPolyline],
                (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    console.log("added activity successfully");
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
                "UPDATE selectedAthlete SET stravaAthleteId =  (?) ",
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