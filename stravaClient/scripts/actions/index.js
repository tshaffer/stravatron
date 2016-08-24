/**
 * Created by tedshaffer on 8/24/16.
 */
var https = require('https');

export const SET_SUMMARY_ACTIVITIES = 'SET_SUMMARY_ACTIVITIES';
export function setSummaryActivities(summaryActivities) {

    return {
        type: SET_SUMMARY_ACTIVITIES,
        summaryActivities
    }
}


export function loadSummaryActivities() {

    return function(dispatch, getState) {

        console.log("actions/index.js::loadSummaryActivities invoked");

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

                debugger;

                dispatch(setSummaryActivities(summaryActivities));
            });

        }).on('error', function () {
            console.log('Caught exception: ' + err);
        });
    }
}

