const mysql = require('mysql');

import Activity from '../entities/activity';

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
            let createActivitiesTablePromise = self.createActivitiesTable();
            let createSelectedAthletePromise = self.createSelectedAthleteTable();
            let createStreamsTablePromise = self.createStreamsTable();
            let createMapsPromise = self.createMapsTable();
            Promise.all([createAthletesPromise, createActivitiesTablePromise, createSelectedAthletePromise, createStreamsTablePromise, createMapsPromise]).then(value => {
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

    createStreamsTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.dbConnection.query(
                "CREATE TABLE IF NOT EXISTS streams ("
                + "id MEDIUMINT NOT NULL AUTO_INCREMENT, "
                + "activityId VARCHAR(32) NOT NULL, "
                + "streamData JSON NOT NULL, "
                + "PRIMARY KEY(id))",
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    console.log("create streams successful");
                    resolve();
                }
            );
        });
    }

    addStream(activityId, streamData) {

        return new Promise( (resolve, reject) => {
            this.dbConnection.query(
                "INSERT INTO streams (activityId, streamData) " +
                " VALUES (?, ?)",
                [activityId, JSON.stringify(streamData)],
                (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    console.log("added stream successfully");
                    resolve();
                }
            );
        });

    }

    createActivitiesTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.dbConnection.query(
                "CREATE TABLE IF NOT EXISTS activities ("
                + "id VARCHAR(32) NOT NULL, "
                + "athleteId VARCHAR(32) NOT NULL, "
                + "averageSpeed FLOAT NOT NULL, "
                + "description VARCHAR(512) NOT NULL, "
                + "distance FLOAT NOT NULL, "
                + "elapsedTime INT NOT NULL, "
                + "kilojoules FLOAT NOT NULL, "
                + "city VARCHAR(64) NOT NULL, "
                + "mapPolyline TEXT, "
                + "mapSummaryPolyline TEXT NOT NULL, "
                + "maxSpeed FLOAT NOT NULL, "
                + "movingTime INT NOT NULL, "
                + "name VARCHAR(64) NOT NULL, "
                + "startDateLocal DATETIME NOT NULL, "
                + "startLatitude FLOAT NOT NULL, "
                + "startLongitude FLOAT NOT NULL, "
                + "endLatitude FLOAT NOT NULL, "
                + "endLongitude FLOAT NOT NULL, "
                + "totalElevationGain INT NOT NULL, "
                + "PRIMARY KEY(id))",
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    console.log("create activities successful");
                    resolve();
                }
            );
        });
    }

    addDetailsToActivity(stravaDetailedActivityId, detailedActivityAttributes) {
        return new Promise( (resolve, reject) => {
            this.dbConnection.query(
                "UPDATE activities SET mapPolyline = ? WHERE id=?",
                [detailedActivityAttributes.mapPolyline, stravaDetailedActivityId],
                (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    console.log("added details to activity successfully");
                    resolve();
                }
            );
        });
    }

    addActivity(activity) {

        const a = Object.assign({}, activity);
        a.startDateLocal = new Date(a.startDateLocal);
        a.startLatitude = activity.startLatitudeLongitude[0];
        a.startLongitude = activity.startLatitudeLongitude[1];
        a.endLatitude = activity.endLatitudeLongitude[0];
        a.endLongitude = activity.endLatitudeLongitude[1];

        return new Promise( (resolve, reject) => {
            const startDate = new Date(a.startDateLocal);
            this.dbConnection.query(
                "INSERT INTO activities (id, athleteId, averageSpeed, description, distance, elapsedTime, kilojoules, city, mapSummaryPolyline, maxSpeed, " +
                "movingTime, name, startDateLocal, startLatitude, startLongitude, endLatitude, endLongitude, totalElevationGain) " +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [a.id, a.athleteId, a.averageSpeed, a.description, a.distance, a.elapsedTime, a.kilojoules, a.city, a.mapSummaryPolyline, a.maxSpeed,
                    a.movingTime, a.name, a.startDateLocal, a.startLatitude, a.startLongitude, a.endLatitude, a.endLongitude, a.totalElevationGain],
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


    getActivities(athleteId) {

        return new Promise( (resolve, reject) => {

            console.log("getActivities invoked");

            var query = "SELECT * FROM activities " +
                "WHERE athleteId=?";

            this.dbConnection.query(
                query,
                [athleteId],
                (err, rows) => {

                    let dbActivities = [];
                    rows.forEach( row => {

                        let dbActivity = {
                            id: row.id,
                            athleteId : row.athleteId,
                            averageSpeed : row.averageSpeed,
                            city : row.city,
                            distance : row.distance,
                            elapsedTime : row.elapsedTime,
                            endLatitude : row.endLatitude,
                            endLongitude : row.endLongitude,
                            kilojoules : row.kilojoules,
                            mapSummaryPolyline : row.mapSummaryPolyline,
                            maxSpeed : row.maxSpeed,
                            movingTime : row.movingTime,
                            name : row.name,
                            startDateLocal : row.startDateLocal,
                            startLatitude : row.startLatitude,
                            startLongitude : row.startLongitude,
                            totalElevationGain : row.totalElevationGain,
                            segmentEffortIds : [],
                        };
                        if (row.mapPolyline) {
                            dbActivity.mapPolyline = row.mapPolyline;
                        }

                        dbActivities.push(dbActivity);
                    });

                    resolve(dbActivities);
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