const mysql = require('mysql');

export default class MysqlServices {


    constructor() {
        this.dbHostName = 'localhost';
    }


    initialize() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.db = mysql.createConnection({
                host: self.dbHostName,
                user: 'ted',
                password: 'hello69',
                database: 'stravatron'
            });

            self.db.connect();

            let reason = {};
            let promises = [];
            let createTablesPromise = self.createAthletesTable();
            let createMapsPromise = self.createMapsTable();
            Promise.all([createTablesPromise, createMapsPromise]).then(value => {
                resolve(self.db);
            }, reason => {
                reject(reason);
            });
        });
    }

    createAthletesTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.db.query(
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
            this.db.query(
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

    createMapsTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.db.query(
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
            this.db.query(
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