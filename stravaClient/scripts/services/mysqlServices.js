const mysql = require('mysql');

export default class MysqlServices {


    constructor() {
        this.dbHostName = 'localhost';
    }


    initialize() {
        this.db = mysql.createConnection({
            host: this.dbHostName,
            user: 'ted',
            password: 'hello69',
            database: 'stravatron'
        });

        this.db.connect();

        let promises = [];
        promises.push(this.createAthletesTable());
        promises.push(this.createMapsTable());
        return promises;
    }

    createAthletesTable() {

        var self = this;

        return new Promise( (resolve, reject) => {
            self.db.query(
                "CREATE TABLE IF NOT EXISTS athletes ("
                + "athleteId VARCHAR(32) NOT NULL, "
                + "accessToken VARCHAR(64) NOT NULL,"
                + "name VARCHAR(32) NOT NULL, "
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

    addAthlete(athleteId, accessToken, name, firstname, lastname, email) {
        return new Promise( (resolve, reject) => {
            this.db.query(
                "INSERT INTO athletes (athleteId, accessToken, name, firstname, lastname, email) " +
                " VALUES (?, ?, ?, ?, ?, ?)",
                [athleteId.toString(), accessToken, name, firstname, lastname, email],
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
                + "name VARCHAR(64) NOT NULL,"
                + "style VARCHAR(64) NOT NULL, "
                + "PRIMARY KEY(style))",
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

    addMap(name, style) {
        return new Promise( (resolve, reject) => {
            this.db.query(
                "INSERT INTO maps (name, style) " +
                " VALUES (?, ?)",
                [name, style],
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