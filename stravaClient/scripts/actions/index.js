/**
 * Created by tedshaffer on 8/24/16.
 */
const https = require('https');
const fs = require('fs');

import Segment from '../entities/segment';
import SegmentEffort from '../entities/segmentEffort';
import Activity from '../entities/activity';

import DBServices from '../services/dbServices';

export const SET_SELECTED_ATHLETE = 'SET_SELECTED_ATHLETE';
export function setSelectedAthlete(athlete) {
    return {
        type: SET_SELECTED_ATHLETE,
        athlete
    };
}

export const ADD_EFFORTS_FOR_SEGMENT = 'ADD_EFFORTS_FOR_SEGMENT';
function addEffortsForSegment(segmentId, effortsForSegment) {
    return {
        type: ADD_EFFORTS_FOR_SEGMENT,
        segmentId,
        effortsForSegment
    };
}

export const ADD_ACTIVITIES = 'ADD_ACTIVITIES';
export function addActivities(activities) {

    return {
        type: ADD_ACTIVITIES,
        activities
    };
}


export const ADD_ACTIVITY_MAP = 'ADD_ACTIVITY_MAP';
export function addActivityMap(activityId, map) {

    return {
        type: ADD_ACTIVITY_MAP,
        activityId,
        map
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

export const ADD_SEGMENTS = 'ADD_SEGMENTS';
export function addSegments(segments) {

    return {
        type: ADD_SEGMENTS,
        segments
    };
}

export const ADD_DETAILED_SEGMENT_ATTRIBUTES = 'ADD_DETAILED_SEGMENT_ATTRIBUTES';
export function addDetailedSegmentAttributes(detailedSegmentsAttributes) {

    return {
        type: ADD_DETAILED_SEGMENT_ATTRIBUTES,
        detailedSegmentsAttributes
    };
}


export const ADD_SEGMENT_EFFORTS = 'ADD_SEGMENT_EFFORTS';
export function addSegmentEfforts(segmentEfforts) {

    return {
        type: ADD_SEGMENT_EFFORTS,
        segmentEfforts
    };
}

function getResponseData(state = null) {

    let responseData = {};

    if (state) {
        const athlete = state.selectedAthlete;
        if (athlete) {
            responseData.athlete = {};
            responseData.athlete.id = athlete.stravaAthleteId;
            responseData.athlete.firstname = athlete.firstname;
            responseData.athlete.lastname = athlete.lastname;
            responseData.athlete.email = athlete.email;
            responseData.accessToken = athlete.accessToken;
            return responseData;
        }
    }

    debugger;

    return null;
}

function fetchStravaData(endPoint, state) {

    console.log("actions/index.js::fetchStravaData from " + endPoint);

    return new Promise(function (resolve, reject) {

        const responseData = getResponseData(state);

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
                resolve(data);
            });

        }).on('error', function (err) {
            console.log('Caught exception: ' + err);
            reject(err);
        });
    });
}

function fetchStream(activityId, getState) {

    return new Promise((resolve) => {

        console.log("actions/index.js::fetchStream invoked: ", activityId);

        fetchStravaData('activities/' + activityId + '/streams/time,latlng,distance,altitude,grade_smooth', getState()).then( (stravaStreams) => {
            resolve(stravaStreams);
        });
    });
}

function fetchAllEfforts(athleteId, segmentId, getState) {
    // return new Promise((resolve, reject) => {
    return new Promise((resolve) => {

        console.log("actions/index.js::fetchAllEfforts invoked: ", segmentId);

        fetchStravaData("segments/" + segmentId.toString() + '/all_efforts?athlete_id=' + athleteId.toString(), getState()).then( (stravaAllEfforts) => {
            resolve(stravaAllEfforts);
        });
    });
}


function fetchSegment(segmentId, getState) {

    // return new Promise((resolve, reject) => {
    return new Promise((resolve) => {

        console.log("actions/index.js::fetchSegment invoked: ", segmentId);

        fetchStravaData("segments/" + segmentId, getState()).then( (stravaDetailedSegment)=> {
            resolve(stravaDetailedSegment);
        });
    });
}

export function loadActivityMap(activityId) {

    return function(dispatch, getState) {

        console.log("actions/index.js::loadActivityMap invoked");
        fetchStravaData("activities/" + activityId, getState()).then((stravaDetailedActivity)=> {
            dispatch(addActivityMap(stravaDetailedActivity.id, stravaDetailedActivity.map));
            let s = getState();
        });
    };
}

export function loadDetailedActivity(activityId) {

    return function(dispatch, getState) {

        console.log("actions/index.js::loadDetailedActivity invoked");

        fetchStravaData("activities/" + activityId, getState()).then((stravaDetailedActivity)=> {

            // retrieve streams for this activity
            // ** what if all the efforts are retrieved before streams are retrieved? is that a problem?
            fetchStream(activityId, getState).then((stravaStreams) => {
                console.log("streams retrieved");

                // stravaStreams is an array of objects
                // each object has the following data members
                //      data
                //          array of locations
                //      original_size
                //          int
                //      resolution
                //          string = 'high'
                //      series_type
                //          string = 'distance'
                //      type
                //          string = 'latlng'
                const detailedActivityAttributes =
                    {
                        "calories": stravaDetailedActivity.calories,
                        "segmentEfforts": stravaDetailedActivity.segment_efforts,
                        "map": stravaDetailedActivity.map,
                        "streams": stravaStreams
                    };
                dispatch(addDetailedActivityAttributes(stravaDetailedActivity.id, detailedActivityAttributes));
            });

            let segments = [];
            let segmentIds = [];
            let segmentEfforts = [];

            stravaDetailedActivity.segment_efforts.forEach((stravaSegmentEffort) => {

                const segment = new Segment(stravaSegmentEffort.segment);
                segments.push(segment);

                segmentIds.push(stravaSegmentEffort.segment.id);

                const segmentEffort = new SegmentEffort(stravaSegmentEffort);
                segmentEfforts.push(segmentEffort);
            });

            dispatch(addSegmentEfforts(segmentEfforts));

            dispatch(addSegments(segments));

            // retrieve all efforts for each of the segments in this activity
            let fetchAllEffortsPromises = [];
            const athleteId = "2843574";            // pa
            // const athleteId = "7085811";         // ma
            segmentIds.forEach((segmentId) => {
                fetchAllEffortsPromises.push(fetchAllEfforts(athleteId, segmentId, getState));
            });

            let allEffortsList = [];

            Promise.all(fetchAllEffortsPromises).then(allEffortsForSegmentsInCurrentActivity => {

                if (allEffortsForSegmentsInCurrentActivity instanceof Array) {

                    allEffortsForSegmentsInCurrentActivity.forEach(allEffortsForSegment => {
                        if (allEffortsForSegment instanceof Array) {

                            // get information about segment as appropriate, presumably from first 'effort for segment'

                            // convert to stravatron segmentEfforts
                            segmentEfforts = [];
                            allEffortsForSegment.forEach((stravaSegmentEffort) => {
                                const segmentEffort = new SegmentEffort(stravaSegmentEffort);
                                segmentEfforts.push(segmentEffort);

                            });

                            // add all individual segment efforts to store
                            let beforeState = getState();
                            dispatch(addSegmentEfforts(segmentEfforts));
                            let afterState = getState();

                            // add all efforts for this segment to store
                            if (segmentEfforts.length > 0) {
                                dispatch(addEffortsForSegment(segmentEfforts[0].segmentId, segmentEfforts));
                            }
                            afterState = getState();
                        }
                    });
                }
            });

            let fetchSegmentPromises = [];
            segmentIds.forEach((segmentId) => {
                fetchSegmentPromises.push(fetchSegment(segmentId, getState));
            });

            let detailedSegmentsAttributes = [];

            Promise.all(fetchSegmentPromises).then(segments => {

                segments.forEach(segment => {
                    detailedSegmentsAttributes.push(
                        {
                            "id": segment.id,
                            "createdAt": segment.created_at,
                            "totalElevationGain": segment.total_elevation_gain,
                            "map": segment.map,
                            "effortCount": segment.effort_count
                        }
                    );
                });

                dispatch(addDetailedSegmentAttributes(detailedSegmentsAttributes));
            });
        });
    };
}

export function fetchAndUpdateSummaryActivities() {

    return function(dispatch, getState) {

        // get summaryActivities from db for current athlete

        // initialize redux store with these summaryActivities

        // get the timestamp of the most recent activity - retrieve the summary activities with timestamps > than the most recent summary activity
        let secondsSinceEpochOfLastActivity = 0;      // seconds since epoch
        fetchSummaryActivities(secondsSinceEpochOfLastActivity, getState).then( (activities)=> {
            let state = getState();
            debugger;
            const dbServices = state.db.dbServices;

            let promises = [];
            activities.forEach((activity) => {
                promises.push(dbServices.addSummaryActivity(activity));
            });
        });



        // store these additional summary activities in the db and the store
    };
}

function fetchSummaryActivities(secondsSinceEpochOfLastActivity, getState) {

    return new Promise((resolve, reject) => {

        var path = "athlete/activities?after=" + secondsSinceEpochOfLastActivity;

        fetchStravaData(path, getState()).then( (stravaSummaryActivities)=> {

            let activities = [];

            if (!(stravaSummaryActivities instanceof Array)) {
                console.log("stravaSummaryActivities not array");
                reject("error");
            }

            stravaSummaryActivities.forEach( (stravaActivity) => {
                const summaryActivity = new Activity(stravaActivity);
                activities.push(summaryActivity);
            });

            resolve(activities);
        });
    });
}

export function loadSummaryActivities() {

    return function(dispatch, getState) {

        console.log("actions/index.js::loadSummaryActivities invoked");

        // test with after
        // var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
        var d = new Date();
        d.setMonth(5);

        var n = Math.floor(d.getTime()/1000);
        var secondsSinceEpoch = n.toString();
        // var endPoint = "athlete/activities?after=" + secondsSinceEpoch;
        // var endPoint = "athlete/activities?per_page=1";
        var endPoint = "athlete/activities?after=" + n;
        debugger;

        // fetchStravaData(endPoint, getState()).then( (stravaSummaryActivities)=> {
        fetchStravaData("athlete/activities", getState()).then( (stravaSummaryActivities)=> {

            debugger;

            let activities = [];

            if (!(stravaSummaryActivities instanceof Array)) {
                console.log("stravaSummaryActivities not array");
                debugger;
                return;
            }

            stravaSummaryActivities.forEach( (stravaActivity) => {
                const summaryActivity = new Activity(stravaActivity);
                activities.push(summaryActivity);
            });

            dispatch(addActivities(activities));
        });
    };
}

export const SET_CUSTOM_MAP_SEGMENTS = 'SET_CUSTOM_MAP_SEGMENTS';
export function SetCustomMapSegments(customMapSegments) {

    return {
        type: SET_CUSTOM_MAP_SEGMENTS,
        customMapSegments
    };
}


export function retrieveCustomSegmentData() {

    return function(dispatch, getState) {
        var self;
        fs.readFile('segments.json', (err, data) => {

            // check err and do something with it.

            const customSegmentsData = JSON.parse(data);
            dispatch(SetCustomMapSegments(customSegmentsData));
        });
    };
}

export const SET_BASE_MAP_SEGMENTS = 'SET_BASE_MAP_SEGMENTS';
export function SetBaseMapSegments(baseMapSegments) {

    return {
        type: SET_BASE_MAP_SEGMENTS,
        baseMapSegments
    };
}

export function retrieveBaseMapSegments() {

    let baseMapSegmentIds = [];
    let baseMapSegments = [];

    return function(dispatch, getState) {

        console.log("actions/index.js::retrieveBaseMapSegments invoked");
        fetchStravaData("segments/starred", getState()).then((starredSegments)=> {

            if (!(starredSegments instanceof Array)) {
                console.log("starredSegments not array");
                return;
            }

            // retrieve the starred segments for the chosen locale
            starredSegments.forEach( (segment) => {
                // console.log(segment.name + " in " + segment.city);

                // only retrieve segment id's for the appropriate cities
                if (segment.city === "Santa Cruz" || segment.city === "Felton") {
                    console.log("relevant segment ", segment.name, " has id: " + segment.id);

                    baseMapSegmentIds.push(segment.id);
                }
                else {
                    console.log("reject segment ", segment.name);
                }
            });

            // get the detailed segment data for each of the starred segments
            let fetchSegmentPromises = [];
            baseMapSegmentIds.forEach( (segmentId) => {
                fetchSegmentPromises.push(fetchSegment(segmentId, getState));
            });

            // wait until all data has been received
            Promise.all(fetchSegmentPromises).then(baseSegments => {

                baseSegments.forEach( (baseSegment) => {
                    let baseMapSegment = {
                        id: baseSegment.id,
                        name: baseSegment.name,
                        polyline: baseSegment.map.polyline,
                        startLatitude: baseSegment.start_latitude,
                        startLongitude: baseSegment.start_longitude
                    };
                    baseMapSegments.push(baseMapSegment);
                });

                // add to redux
                dispatch(SetBaseMapSegments(baseMapSegments));

            });
        });
    };

}
