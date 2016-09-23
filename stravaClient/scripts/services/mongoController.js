var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var athleteSchema = new Schema({
    label:  String,
    firstName:  String,
    lastName: String,
    email: String,
    accessToken: String
});

var Athlete = mongoose.model('Athlete', athleteSchema);

function initialize() {

    return new Promise(function (resolve, reject) {

        mongoose.connect('mongodb://localhost/stravatron');

        var db = mongoose.connection;
        db.on('error', function() {
            reject();
        });
        db.once('open', function() {
            console.log("connected to shafferotoTest");
            resolve();
        });
    });
}

function fetchAthletes() {

    return new Promise( (resolve, reject) => {

        let athletes = [];

        Athlete.find({}, null, (err, athleteDocs) => {
            if (err) {
                console.log("error returned from mongoose query");
                reject();
            }

            athleteDocs.forEach(function (athleteDoc) {
                athletes.push(
                    {
                        id: athleteDoc.id,
                        label: athleteDoc.label,
                        firstName: athleteDoc.firstName,
                        lastName: athleteDoc.lastName,
                        email: athleteDoc.email,
                        accessToken: athleteDoc.accessToken });
            });

            resolve(athletes);
        });
    });
}


