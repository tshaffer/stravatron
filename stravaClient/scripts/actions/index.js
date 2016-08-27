/**
 * Created by tedshaffer on 8/24/16.
 */
const https = require('https');

import SegmentEffort from '../entities/segmentEffort';
import SummaryActivity from '../entities/summaryActivity';

export const ADD_SUMMARY_ACTIVITIES = 'ADD_SUMMARY_ACTIVITIES';
export function addSummaryActivities(summaryActivities) {

    return {
        type: ADD_SUMMARY_ACTIVITIES,
        summaryActivities
    };
}

export const ADD_DETAILED_ACTIVITY_ATTRIBUTES = 'ADD_DETAILED_ACTIVITY_ATTRIBUTES';
export function addDetailedActivityAttributes(activityId, detailedActivityAttributes) {

    return {
        type: ADD_DETAILED_ACTIVITY_ATTRIBUTES,
        activityId,
        detailedActivityAttributes
    };
}

export const ADD_SEGMENT_EFFORTS = 'ADD_SEGMENT_EFFORTS';
export function addSegmentEfforts(segmentEfforts) {

    return {
        type: ADD_SEGMENT_EFFORTS,
        segmentEfforts
    };
}

// hardcoded for now
function getAthleteData() {
    
    let athlete = {};
    athlete.id = "2843574";
    athlete.firstName = "Ted";
    athlete.lastName = "Shaffer";
    athlete.email = "shaffer_family@yahoo.com";

    return athlete;
}

function getResponseData() {

    let responseData = {};
    responseData.accessToken = "fb8085cc4c7f3633533e875eae3dc1e04cef06e8";
    responseData.athlete = getAthleteData();

    return responseData;
}


// function fetchStreamFromStrava(responseData, detailedActivityData, detailedActivityIdToFetchFromServer, detailedActivityIdsToFetchFromServer, idsOfActivitiesFetchedFromStrava) {
//
//     var str = "";
//
//     var options = {
//         host: 'www.strava.com',
//         path: '/api/v3/activities/' + detailedActivityIdToFetchFromServer.toString() + '/streams/time,latlng,distance,altitude,grade_smooth',
//         port: 443,
//         headers: {
//             'Authorization': 'Bearer ' + responseData.accessToken
//         }
//     };
//
//     https.get(options, function (streamResponse) {
//         console.log('STATUS: ' + streamResponse.statusCode);
//         console.log('HEADERS: ' + JSON.stringify(streamResponse.headers));
//
//         streamResponse.on('data', function (d) {
//             str += d;
//             console.log("stream chunk received for detailedActivityIdToFetchFromServer = " + detailedActivityIdToFetchFromServer);
//         });
//
//         streamResponse.on('end', function () {
//             console.log("end received for stream fetch of detailedActivityIdToFetchFromServer = " + detailedActivityIdToFetchFromServer);
//
//             idsOfActivitiesFetchedFromStrava.push(detailedActivityIdToFetchFromServer);
//
//             // what is the length of the stream?
//             detailedActivityData.stream = str;
//             console.log("length of stream string is: " + detailedActivityData.stream.length);
//
//             // convert from Strava JSON format into the format digestible by the db
//             var convertedActivity = convertDetailedActivity(detailedActivityData);
//             responseData.detailedActivitiesToReturn.push(convertedActivity);
//
//             // retrieve segment effort ids (and segment id's?) from detailed activity
//             segmentEfforts = detailedActivityData.segment_efforts;
//             console.log("number of segment efforts for this activity is " + segmentEfforts.length);
//
//             segmentEfforts.forEach(addSegmentEffortIdToDB);
//
//             console.log("check for completion");
//             if (idsOfActivitiesFetchedFromStrava.length == Object.keys(detailedActivityIdsToFetchFromServer).length) {
//                 console.log("all detailed activities fetched from strava");
//                 sendActivitiesResponse(responseData.serverResponse, responseData.detailedActivitiesToReturn);
//                 return;
//             }
//         });
//     });
// }

function fetchStravaData(endPoint) {

    console.log("actions/index.js::fetchStravaData from " + endPoint);

    return new Promise(function (resolve, reject) {

        const responseData = getResponseData();

        var options = {
            host: 'www.strava.com',
            path: '/api/v3/' + endPoint,
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
                var data = JSON.parse(str);
                console.log("strava data retrieved from " + endPoint);
                resolve(data);
            });

        }).on('error', function (err) {
            console.log('Caught exception: ' + err);
            reject(err);
        });
    });
}

// function listRoutes() {
//
//     // GET https://www.strava.com/api/v3/athletes/:id/routes
//     console.log("actions/index.js::listRoutes invoked");
//
//     const responseData = getResponseData();
//
//     var options = {
//         host: 'www.strava.com',
//         path: '/api/v3/athletes/2843574/routes',
//         port: 443,
//         headers: {
//             'Authorization': 'Bearer ' + responseData.accessToken
//         }
//     };
//
//     var routeListStr = "";
//
//     https.get(options, function (res) {
//
//         res.on('data', function (d) {
//             console.log("chunk received");
//             routeListStr += d;
//         });
//         res.on('end', function () {
//             console.log("end received");
//
//             var routeList = JSON.parse(routeListStr);
//
//             console.log("routeList retrieved");
//
//             debugger;
//         });
//
//     }).on('error', function () {
//         console.log('Caught exception: ' + err);
//     });
//
// }
// function loadRoute() {
//
//     // GET https://www.strava.com/api/v3/routes/:routeid
//
//     console.log("actions/index.js::loadRoute invoked");
//
//     const responseData = getResponseData();
//
//     var options = {
//         host: 'www.strava.com',
//         path: '/api/v3/routes/6288858',
//         port: 443,
//         headers: {
//             'Authorization': 'Bearer ' + responseData.accessToken
//         }
//     };
//
//     var routeStr = "";
//
//     https.get(options, function (res) {
//
//         res.on('data', function (d) {
//             console.log("chunk received");
//             routeStr += d;
//         });
//         res.on('end', function () {
//             console.log("end received");
//
//             var route = JSON.parse(routeStr);
//
//             console.log("route retrieved");
//
//             debugger;
//         });
//
//     }).on('error', function () {
//         console.log('Caught exception: ' + err);
//     });
//
// }
// function loadRouteStream() {
//
//     // GET https://www.strava.com/api/v3/routes/:id/streams
//     console.log("actions/index.js::loadRouteStream invoked");
//
//     const responseData = getResponseData();
//
//     var options = {
//         host: 'www.strava.com',
//         path: '/api/v3/routes/6288858/streams',
//         port: 443,
//         headers: {
//             'Authorization': 'Bearer ' + responseData.accessToken
//         }
//     };
//
//     var streamsStr = "";
//
//     https.get(options, function (res) {
//
//         res.on('data', function (d) {
//             console.log("chunk received");
//             streamsStr += d;
//         });
//         res.on('end', function () {
//             console.log("end received");
//
//             var streams = JSON.parse(streamsStr);
//
//             console.log("streams retrieved");
//
//             debugger;
//         });
//
//     }).on('error', function () {
//         console.log('Caught exception: ' + err);
//     });
//
//
// }

export function loadDetailedActivity(activityId) {

    return function(dispatch) {

        console.log("actions/index.js::loadDetailedActivity invoked");

        fetchStravaData("activities/" + activityId).then( (stravaDetailedActivity)=> {

            debugger;
            let segmentEfforts = [];

            stravaDetailedActivity.segment_efforts.forEach( (stravaSegmentEffort) => {
                const segmentEffort = new SegmentEffort(stravaSegmentEffort);
                segmentEfforts.push(segmentEffort);

                // extract the segment and add it to the store
            });
            dispatch(addSegmentEfforts(segmentEfforts));

            const detailedActivityAttributes =
                {
                    "calories": stravaDetailedActivity.calories,
                    "segmentEfforts": stravaDetailedActivity.segment_efforts,
                    "map": stravaDetailedActivity.map
                };
            dispatch(addDetailedActivityAttributes(stravaDetailedActivity.id, detailedActivityAttributes));
        });
    };
}

export function loadSummaryActivities() {

    return function(dispatch) {

        console.log("actions/index.js::loadSummaryActivities invoked");

        fetchStravaData("athlete/activities").then( (stravaSummaryActivities)=> {

            let summaryActivities = [];

            stravaSummaryActivities.forEach( (stravaSummaryActivity) => {
                const summaryActivity = new SummaryActivity(stravaSummaryActivity);
                summaryActivities.push(summaryActivity);
            });

            dispatch(addSummaryActivities(summaryActivities));
        });

    };
}

