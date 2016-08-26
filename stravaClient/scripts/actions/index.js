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


function getResponseData() {

    let responseData = {};
    responseData.accessToken = "fb8085cc4c7f3633533e875eae3dc1e04cef06e8";
    responseData.athlete = {};
    responseData.athlete.id = "2843574";
    responseData.athlete.firstName = "Ted";
    responseData.athlete.lastName = "Shaffer"
    responseData.athlete.email = "shaffer_family@yahoo.com";

    return responseData;
}

export function loadDetailedActivity(detailedActivityIdToFetchFromServer, detailedActivityIdsToFetchFromServer, idsOfActivitiesFetchedFromStrava) {

    return function(dispatch, getState) {

        console.log("actions/index.js::loadDetailedActivity invoked");

        const responseData = getResponseData();

        var options = {
            host: 'www.strava.com',
            path: '/api/v3/athlete/activities/' + detailedActivityIdToFetchFromServer.toString(),
            port: 443,
            headers: {
                'Authorization': 'Bearer ' + responseData.accessToken
            }
        };

        var str = "";

        https.get(options, function (res) {
            res.on('data', function (d) {
                str += d;

            });
            res.on('end', function () {
                // convert string from server into JSON object
                var detailedActivityData = JSON.parse(str);
                fetchStreamFromStrava(responseData, detailedActivityData, detailedActivityIdToFetchFromServer, detailedActivityIdsToFetchFromServer, idsOfActivitiesFetchedFromStrava);
            });

        }).on('error', function () {
            console.log('Caught exception: ' + err);
        });

        // var summaryActivitiesStr = "";
        //
        // https.get(options, function (res) {
        //
        //     res.on('data', function (d) {
        //         console.log("chunk received");
        //         summaryActivitiesStr += d;
        //     });
        //     res.on('end', function () {
        //         console.log("end received");
        //
        //         var summaryActivities = JSON.parse(summaryActivitiesStr);
        //
        //         console.log("summaryActivities retrieved");
        //
        //         debugger;
        //
        //         dispatch(setSummaryActivities(summaryActivities));
        //     });
        //
        // }).on('error', function () {
        //     console.log('Caught exception: ' + err);
        // });
    }

}

function fetchStreamFromStrava(responseData, detailedActivityData, detailedActivityIdToFetchFromServer, detailedActivityIdsToFetchFromServer, idsOfActivitiesFetchedFromStrava) {

    var str = "";

    var options = {
        host: 'www.strava.com',
        path: '/api/v3/activities/' + detailedActivityIdToFetchFromServer.toString() + '/streams/time,latlng,distance,altitude,grade_smooth',
        port: 443,
        headers: {
            'Authorization': 'Bearer ' + responseData.accessToken
        }
    };

    https.get(options, function (streamResponse) {
        console.log('STATUS: ' + streamResponse.statusCode);
        console.log('HEADERS: ' + JSON.stringify(streamResponse.headers));

        streamResponse.on('data', function (d) {
            str += d;
            console.log("stream chunk received for detailedActivityIdToFetchFromServer = " + detailedActivityIdToFetchFromServer);
        });

        streamResponse.on('end', function () {
            console.log("end received for stream fetch of detailedActivityIdToFetchFromServer = " + detailedActivityIdToFetchFromServer);

            idsOfActivitiesFetchedFromStrava.push(detailedActivityIdToFetchFromServer);

            // what is the length of the stream?
            detailedActivityData.stream = str;
            console.log("length of stream string is: " + detailedActivityData.stream.length);

            // convert from Strava JSON format into the format digestible by the db
            var convertedActivity = convertDetailedActivity(detailedActivityData);
            responseData.detailedActivitiesToReturn.push(convertedActivity);

            // retrieve segment effort ids (and segment id's?) from detailed activity
            segmentEfforts = detailedActivityData.segment_efforts;
            console.log("number of segment efforts for this activity is " + segmentEfforts.length);

            segmentEfforts.forEach(addSegmentEffortIdToDB);

            console.log("check for completion");
            if (idsOfActivitiesFetchedFromStrava.length == Object.keys(detailedActivityIdsToFetchFromServer).length) {
                console.log("all detailed activities fetched from strava");
                sendActivitiesResponse(responseData.serverResponse, responseData.detailedActivitiesToReturn);
                return;
            }
        });
    });
}

function listRoutes() {

    // GET https://www.strava.com/api/v3/athletes/:id/routes
    console.log("actions/index.js::listRoutes invoked");

    const responseData = getResponseData();

    var options = {
        host: 'www.strava.com',
        path: '/api/v3/athletes/2843574/routes',
        port: 443,
        headers: {
            'Authorization': 'Bearer ' + responseData.accessToken
        }
    };

    var routeListStr = "";

    https.get(options, function (res) {

        res.on('data', function (d) {
            console.log("chunk received");
            routeListStr += d;
        });
        res.on('end', function () {
            console.log("end received");

            var routeList = JSON.parse(routeListStr);

            console.log("routeList retrieved");

            debugger;
        });

    }).on('error', function () {
        console.log('Caught exception: ' + err);
    });

}
function loadRoute() {

    console.log("actions/index.js::loadRoute invoked");

    const responseData = getResponseData();

    var options = {
        host: 'www.strava.com',
        path: '/api/v3/routes/6288858',
        port: 443,
        headers: {
            'Authorization': 'Bearer ' + responseData.accessToken
        }
    };

    var routeStr = "";

    https.get(options, function (res) {

        res.on('data', function (d) {
            console.log("chunk received");
            routeStr += d;
        });
        res.on('end', function () {
            console.log("end received");

            var route = JSON.parse(routeStr);

            console.log("route retrieved");

            debugger;
        });

    }).on('error', function () {
        console.log('Caught exception: ' + err);
    });

}

function loadRouteStream() {

    // GET https://www.strava.com/api/v3/routes/:id/streams
    console.log("actions/index.js::loadRouteStream invoked");

    const responseData = getResponseData();

    var options = {
        host: 'www.strava.com',
        path: '/api/v3/routes/6288858/streams',
        port: 443,
        headers: {
            'Authorization': 'Bearer ' + responseData.accessToken
        }
    };

    var streamsStr = "";

    https.get(options, function (res) {

        res.on('data', function (d) {
            console.log("chunk received");
            streamsStr += d;
        });
        res.on('end', function () {
            console.log("end received");

            var streams = JSON.parse(streamsStr);

            console.log("streams retrieved");

            debugger;
        });

    }).on('error', function () {
        console.log('Caught exception: ' + err);
    });


}
export function loadSummaryActivities() {

    return function(dispatch, getState) {

        console.log("actions/index.js::loadSummaryActivities invoked");

        const responseData = getResponseData();

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

                loadRouteStream();
                debugger;
                return;

                dispatch(setSummaryActivities(summaryActivities));
            });

        }).on('error', function () {
            console.log('Caught exception: ' + err);
        });
    }
}

