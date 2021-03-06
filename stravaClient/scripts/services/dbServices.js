const mysql = require('mysql');

import Activity from '../entities/activity';
import SegmentEffort from '../entities/segmentEffort';

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
            promises.push(self.createAthletesTable());
            promises.push(self.createActivitiesTable());
            promises.push(self.createSelectedAthleteTable());
            promises.push(self.createSegmentsTable());
            promises.push(self.createSegmentEffortsTable());
            promises.push(self.createStreamsTable());
            promises.push(self.createMapsTable());
            Promise.all(promises).then(value => {
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

    createSegmentsTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.dbConnection.query(
                "CREATE TABLE IF NOT EXISTS segments ("
                + "id VARCHAR(32) NOT NULL, "
                + "averageGrade FLOAT NOT NULL, "
                + "distance FLOAT NOT NULL, "
                + "mapPolyline TEXT NULL, "
                + "name VARCHAR(64) NOT NULL, "
                + "starred TINYINT NOT NULL, "
                + "totalElevationGain INT NULL, "
                + "PRIMARY KEY(id))",
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    console.log("create segments successful");
                    resolve();
                }
            );
        });
    }

    addSegment(segment) {

        return new Promise( (resolve, reject) => {

            const segmentId = segment.id;

            this.dbConnection.query(
                "INSERT INTO segments (id, averageGrade, distance, name, starred) " +
                " VALUES (?, ?, ?, ?, ?)",
                [segment.id, segment.averageGrade, segment.distance, segment.name, segment.starred],
                (err) => {
                    if (err) {
                        console.log("segment add failed for segmentId=", segmentId);
                        console.log(err);
                        reject(err);
                    }
                    resolve();
                }
            );
        });
    }

    addDetailsToSegment(segmentId, detailedSegmentAttributes) {
        return new Promise( (resolve, reject) => {
            this.dbConnection.query(
                "UPDATE segments SET mapPolyline = ?, totalElevationGain = ? WHERE id=?",
                [detailedSegmentAttributes.mapPolyline, detailedSegmentAttributes.totalElevationGain, segmentId],
                (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    resolve();
                }
            );
        });
    }

    getSegmentsForActivity(activityId) {

        var self = this;

        return new Promise((resolve, reject) => {

            let segments = [];

            var query = "SELECT segments.* FROM segments, segmentEfforts WHERE segments.id=segmentEfforts.segmentId AND segmentEfforts.activityId=?";
            self.dbConnection.query(
                query,
                [activityId],
                (err, rows) => {

                    rows.forEach(row => {

                        let segment =
                            {
                                id: row.id,
                                averageGrade: row.averageGrade,
                                distance: row.distance,
                                mapPolyline: row.mapPolyline,
                                name: row.name,
                                starred: row.starred,
                                totalElevationGain: row.totalElevationGain
                            };
                        segments.push(segment);
                    });
                });

            resolve(segments);
        });
    }

    // select segmentEfforts.* from segmentEfforts where segmentEfforts.segmentId in (SELECT segments.id FROM segments, segmentEfforts WHERE (segments.id=segmentEfforts.segmentId AND segmentEfforts.activityId=736756901))
    getSegmentEffortsForActivity(activityId) {

        var self = this;

        return new Promise((resolve, reject) => {

            let segmentEfforts = [];

            var query = "SELECT segmentEfforts.* FROM segmentEfforts where segmentEfforts.segmentId in (SELECT segments.id FROM segments, segmentEfforts WHERE (segments.id=segmentEfforts.segmentId AND segmentEfforts.activityId=?))";

            self.dbConnection.query(
                query,
                [activityId],
                (err, rows) => {

                    rows.forEach(row => {

                        const { activityId, athleteId, distance, id, movingTime, name, segmentId, startDateLocal } = row;

                        let segmentEffort =
                            {
                                id,
                                activityId,
                                athleteId,
                                distance,
                                movingTime,
                                name,
                                segmentId,
                                startDateLocal
                            };
                        segmentEfforts.push(segmentEffort);
                    });

                    resolve(segmentEfforts);

                });

        });

    }

    createSegmentEffortsTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.dbConnection.query(
                "CREATE TABLE IF NOT EXISTS segmentEfforts ("
                + "id VARCHAR(32) NOT NULL, "
                + "activityId VARCHAR(32) NOT NULL, "
                + "athleteId VARCHAR(32) NOT NULL, "
                + "distance FLOAT NOT NULL, "
                + "movingTime INT NOT NULL, "
                + "name VARCHAR(64) NOT NULL, "
                + "segmentId VARCHAR(32) NOT NULL, "
                + "startDateLocal DATETIME NULL, "
                + "PRIMARY KEY(id))",
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                }
            );
        });
    }

    addSegmentEffort(segmentEffort) {

        return new Promise( (resolve, reject) => {

            this.dbConnection.query(
                "INSERT INTO segmentEfforts (id, activityId, athleteId, distance, movingTime, name, segmentId, startDateLocal)" +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [segmentEffort.id, segmentEffort.activityId, segmentEffort.athleteId, segmentEffort.distance, segmentEffort.movingTime, segmentEffort.name, segmentEffort.segmentId, new Date(segmentEffort.startDateLocal)],
                (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    resolve();
                }
            );
        });
    }

    getSegmentEfforts(segmentEffortId) {

        return new Promise((resolve, reject) => {

            let segmentEfforts = [];

            var query = "SELECT * FROM segmentEfforts " +
                "WHERE id=?";
            this.dbConnection.query(
                query,
                [segmentEffortId],
                (err, rows) => {

                    rows.forEach(row => {
                        let segmentEffort =
                            {
                                id: row.id,
                                activityId: row.activity.id,
                                athleteId: row.athlete.id,
                                distance: row.distance,
                                movingTime: row.moving_time,
                                name: row.name,
                                segmentId: row.segment.id,
                                startDateLocal: row.start_date_local,

                            };
                        segmentEfforts.push(segmentEffort);
                    });
                });

            resolve(segmentEfforts);
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
                    resolve();
                }
            );
        });

    }

    getStream(activityId) {
        return new Promise( (resolve, reject) => {
            this.dbConnection.query(
                "SELECT streamData FROM streams WHERE activityId = ?",
                [activityId],
                function (err, rows) {
                    if (err) {
                        reject(err);
                    }

                    if (rows.length > 0) {
                        const streamDataStr = rows[0].streamData;
                        const streamData = JSON.parse(streamDataStr);
                        resolve(streamData);
                    }
                    else {
                        reject("No stream data");
                    }
                });
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
                + "totalElevationGain INT NOT NULL, "
                + "PRIMARY KEY(id))",
                (err) => {
                    if (err) {
                        reject(err);
                    }
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
                    resolve();
                }
            );
        });
    }

    addActivity(activity) {

        const a = Object.assign({}, activity);
        a.startDateLocal = new Date(a.startDateLocal);

        return new Promise( (resolve, reject) => {
            this.dbConnection.query(
                "INSERT INTO activities (id, athleteId, averageSpeed, description, distance, elapsedTime, kilojoules, city, mapSummaryPolyline, maxSpeed, " +
                "movingTime, name, startDateLocal, totalElevationGain) " +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [a.id, a.athleteId, a.averageSpeed, a.description, a.distance, a.elapsedTime, a.kilojoules, a.city, a.mapSummaryPolyline, a.maxSpeed,
                    a.movingTime, a.name, a.startDateLocal, a.totalElevationGain],
                (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    resolve();
                }
            );
        });
    }


    getActivities(athleteId) {

        return new Promise( (resolve, reject) => {

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
                            kilojoules : row.kilojoules,
                            mapSummaryPolyline : row.mapSummaryPolyline,
                            maxSpeed : row.maxSpeed,
                            movingTime : row.movingTime,
                            name : row.name,
                            startDateLocal : row.startDateLocal,
                            totalElevationGain : row.totalElevationGain,
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

                    if (rows.length == 0) {
                        console.log("no athletes found");
                        resolve([]);
                    }
                    else {
                        let athletes = [];
                        rows.forEach( row => {
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
                    // in utility
                    // INSERT INTO selectedAthlete (stravaAthleteId) VALUES ("2843574")

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