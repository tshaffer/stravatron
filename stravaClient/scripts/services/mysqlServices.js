const mysql = require('mysql');

export default class MysqlServices {


    constructor() {
        this.dbHostName = 'localhost';
    }


    initialize() {
        this.connection = mysql.createConnection({
            host: this.dbHostName,
            user: 'ted',
            password: 'hello69',
            database: 'stravatron'
        });

        this.connection.connect();

        const createAthletesPromise = this.createAthletesTable();
        const createMapsTable = this.createMapsTable();
        Promise.all([createAthletesPromise, createMapsTable]).then(values => {
            console.log("create tables complete");
        });
    }

    createAthletesTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.connection.query(
                "CREATE TABLE IF NOT EXISTS athletes ("
                + "athleteId VARCHAR(32) NOT NULL, "
                + "authorizationKey VARCHAR(64) NOT NULL,"
                + "firstname VARCHAR(32) NOT NULL, "
                + "lastname VARCHAR(32) NOT NULL, "
                + "email VARCHAR(64) NOT NULL, "
                + "PRIMARY KEY(athleteId))",
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

    createMapsTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.connection.query(
                "CREATE TABLE IF NOT EXISTS maps ("
                + "mapId VARCHAR(32) NOT NULL, "
                + "name VARCHAR(64) NOT NULL,"
                + "style VARCHAR(64) NOT NULL, "
                + "PRIMARY KEY(mapId))",
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


}