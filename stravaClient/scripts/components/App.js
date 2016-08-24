import React from 'react';
import {Component} from 'react';
import axios from 'axios';

var https = require('https');

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default class App extends Component {

    componentDidMount() {

        debugger;

        console.log("app.js::componentDidMount invoked");

        // const athleteId = "2843574";
        let responseData = {};
        responseData.accessToken = "fb8085cc4c7f3633533e875eae3dc1e04cef06e8";
        responseData.athlete = {};
        responseData.athlete.id = "2843574";
        responseData.athlete.firstName = "Ted";
        responseData.athlete.lastName = "Shaffer"
        responseData.athlete.email = "shaffer_family@yahoo.com";

        var options = {
            host: 'www.strava.com',
            path: '/api/v3/athlete/activities',
            port: 443,
            headers: {
                'Authorization': 'Bearer ' + responseData.accessToken
            }
        };

        var summaryActivitiesStr = "";

        https.get(options, function (res) {

            res.on('data', function (d) {
                console.log("chunk received");
                summaryActivitiesStr += d;
            });
            res.on('end', function () {
                console.log("end received");

                var summaryActivities = JSON.parse(summaryActivitiesStr);

                console.log("summaryActivities retrieved");

                //console.log("summaryActivities");
                //console.log(summaryActivities);

                // summary activities have been retrieved - next step, add any summaryActivities that are not already in the db to the db
                // getDetailedActivitiesInDB(responseData, summaryActivities);
                debugger;
            });

        }).on('error', function () {
            console.log('Caught exception: ' + err);
        });

        // const getAthleteActivitiesUrl = "http://localHost:8080/athleteActivities";
        // axios.get(getAthleteActivitiesUrl,
        //     {
        //         params:
        //         {
        //             dataType: 'json',
        //             data: { "athleteId": athleteId },
        //             error: function() { alert('Failed!')}
        //         }
        //     }).then(function(data) {
        //         console.log("pizza");
        // });
    }

    render() {

        return (
            <MuiThemeProvider>
                <div>
                    pizza
                </div>
            </MuiThemeProvider>
        );
    }
}
