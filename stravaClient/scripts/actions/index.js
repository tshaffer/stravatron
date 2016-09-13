/**
 * Created by tedshaffer on 8/24/16.
 */
const https = require('https');
const fs = require('fs');

import Segment from '../entities/segment';
import SegmentEffort from '../entities/segmentEffort';
import Activity from '../entities/activity';


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

// hardcoded for now
function getAthleteData() {
    
    let athlete = {};
    athlete.id = "2843574";
    athlete.firstName = "Ted";
    athlete.lastName = "Shaffer";
    athlete.email = "shaffer_family@yahoo.com";

    // athlete.id = "7085811";
    // athlete.firstName = "Lori";
    // athlete.lastName = "Shaffer";
    // athlete.email = "loriashaffer@gmail.com";

    return athlete;
}

function getResponseData() {

    let responseData = {};
    responseData.accessToken = "fb8085cc4c7f3633533e875eae3dc1e04cef06e8";          // pa
    // responseData.accessToken = "29ef6b106ea16378e27f6031c60a79a4d445d489";       // ma
    responseData.athlete = getAthleteData();

    return responseData;
}

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
                resolve(data);
            });

        }).on('error', function (err) {
            console.log('Caught exception: ' + err);
            reject(err);
        });
    });
}

function fetchStream(activityId) {

    return new Promise((resolve) => {

        console.log("actions/index.js::fetchStream invoked: ", activityId);

        fetchStravaData('activities/' + activityId + '/streams/time,latlng,distance,altitude,grade_smooth').then( (stravaStreams) => {
            resolve(stravaStreams);
        });
    });
}

function fetchAllEfforts(athleteId, segmentId) {
    // return new Promise((resolve, reject) => {
    return new Promise((resolve) => {

        console.log("actions/index.js::fetchAllEfforts invoked: ", segmentId);

        fetchStravaData("segments/" + segmentId.toString() + '/all_efforts?athlete_id=' + athleteId.toString()).then( (stravaAllEfforts) => {
            resolve(stravaAllEfforts);
        });
    });
}


function fetchSegment(segmentId) {

    // return new Promise((resolve, reject) => {
    return new Promise((resolve) => {

        console.log("actions/index.js::fetchSegment invoked: ", segmentId);

        fetchStravaData("segments/" + segmentId).then( (stravaDetailedSegment)=> {
            resolve(stravaDetailedSegment);
        });
    });
}

export function loadActivityMap(activityId) {

    return function(dispatch, getState) {

        console.log("actions/index.js::loadActivityMap invoked");
        fetchStravaData("activities/" + activityId).then((stravaDetailedActivity)=> {
            dispatch(addActivityMap(stravaDetailedActivity.id, stravaDetailedActivity.map));
            let s = getState();
        });
    };
}

export function loadDetailedActivity(activityId) {

    return function(dispatch, getState) {

        console.log("actions/index.js::loadDetailedActivity invoked");

        fetchStravaData("activities/" + activityId).then((stravaDetailedActivity)=> {

            // retrieve streams for this activity
            // ** what if all the efforts are retrieved before streams are retrieved? is that a problem?
            fetchStream(activityId).then((stravaStreams) => {
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
                fetchAllEffortsPromises.push(fetchAllEfforts(athleteId, segmentId));
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
                fetchSegmentPromises.push(fetchSegment(segmentId));
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

export function loadSummaryActivities() {

    return function(dispatch) {

        console.log("actions/index.js::loadSummaryActivities invoked");

        fetchStravaData("athlete/activities").then( (stravaSummaryActivities)=> {

            let activities = [];

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
        fetchStravaData("segments/starred").then((starredSegments)=> {

            // retrieve the starred segments for the chosen locale
            starredSegments.forEach( (segment) => {
                // console.log(segment.name + " in " + segment.city);

                // only retrieve segment id's for the appropriate cities
                if (segment.city === "Santa Cruz" || segment.city === "Felton") {
                    console.log("relevant segment ", segment.name, " has id: " + segment.id);

                    baseMapSegmentIds.push(segment.id);
                }
            });

            // get the detailed segment data for each of the starred segments
            let fetchSegmentPromises = [];
            baseMapSegmentIds.forEach( (segmentId) => {
                fetchSegmentPromises.push(fetchSegment(segmentId));
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
