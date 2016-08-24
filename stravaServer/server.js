var dbHostName = '127.0.0.1';
//var dbHostName = 'stravadb.cohsjqy0hofx.us-west-1.rds.amazonaws.com';

var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var url = require('url');

var cache = {};

function getSummaryActivitiesFromStrava(responseData) {

    console.log("getSummaryActivitiesFromStrava invoked");

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
            responseData.serverResponse.writeHead(
                200,
                { "content-type": 'application/json' }
            );
            responseData.serverResponse.end(JSON.stringify(summaryActivities, null, 3));

        });

    }).on('error', function () {
        console.log('Caught exception: ' + err);
    });
}


// get a list of activities for the authenticated user
function listAthleteActivities(responseData) {
    console.log('listAthleteActivities invoked');
    console.log('athleteId=', responseData.athleteId);
    getAuthenticatedAthlete(responseData, getSummaryActivitiesFromStrava);
}


function getAuthenticatedAthlete(responseData, nextFunction) {

    responseData.accessToken = "fb8085cc4c7f3633533e875eae3dc1e04cef06e8";
    responseData.athlete = {};
    responseData.athlete.id = "2843574";
    responseData.athlete.firstName = "Ted";
    responseData.athlete.lastName = "Shaffer"
    responseData.athlete.email = "shaffer_family@yahoo.com";
    nextFunction(responseData);

    return;
}

// perform token exchange with Strava server
function performTokenExchange(response, code) {

    console.log("Code is " + parsedUrl.query.code);

    code = parsedUrl.query.code;

    postData = {}

    postData.client_id = 2055;
    postData.client_secret = "85f821429c9da1ef02b627058119a4253eafd16d";
    postData.code = code;

    var postDataStr = JSON.stringify(postData);

    var options = {
        hostname: 'www.strava.com',
        port: 443,
        path: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': postDataStr.length
        }
    };

    var str = ""

    // post token to Strava server; get back access token
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            // console.log("data received");
            str += chunk;
        });
        res.on('end', function () {
            // console.log("end received");
            // console.log(str);

            data = JSON.parse(str);

            authenticationData = {};
            authenticationData.accessToken = data.access_token;
            authenticationData.athleteId = data.athlete.id;
            authenticationData.athlete = {};
            authenticationData.athlete.firstname = data.athlete.firstname;
            authenticationData.athlete.lastname = data.athlete.lastname;
            authenticationData.athlete.email = data.athlete.email;

            console.log("the authentication data is");
            console.log(authenticationData);

            insertAthleteInfo(response, authenticationData);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(postDataStr);
    req.end();
}

function insertAthleteInfo(response, authenticationData) {

    filePath = "public" + "/StravaStatsHome.html";
    var absPath = './' + filePath;

    fs.exists(absPath, function (exists) {
        if (exists) {
            fs.readFile(absPath, function (err, data) {
                if (err) {
                    send404(response);
                } else {
                    // replace placeholder for athlete id with the real value
                    console.log("search for data-athlete");
                    console.log("replace athleteIdPlaceholder with " + authenticationData.athleteId);
                    console.log("type of athleteId is " + typeof authenticationData.athleteId);
                    var dataAsStr = String(data);
                    //console.log("search/replace string:");
                    //console.log(dataAsStr);
                    var finalDataAsStr = dataAsStr.replace("athleteIdPlaceholder", authenticationData.athleteId.toString());
                    finalDataAsStr = finalDataAsStr.replace("athleteNamePlaceholder", authenticationData.athlete.firstname + " " + authenticationData.athlete.lastname);
                    // console.log(finalDataAsStr);
                    console.log("replaced athleteId = " + authenticationData.athleteId.toString());
                    sendFile(response, absPath, finalDataAsStr);
                }
            });
        } else {
            send404(response);
        }
    });

}

function send404(response) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(
      200,
      { "content-type": mime.lookup(path.basename(filePath)) }
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        //cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

var globalCounter = 0;
var requestCounter = 0;
var db;

console.log('begin execution: global counter = ' + globalCounter.toString());
globalCounter++;

var server = http.createServer(function (request, response) {

    console.log('begin execution: request counter = ' + requestCounter.toString());
    requestCounter++;

    var responseData = {};
    responseData.serverResponse = response;

    var filePath = false;

    parsedUrl = url.parse(request.url, true);

    console.log("request url");
    console.log(request.url);
    console.log("parsed url pathname");
    console.log(parsedUrl.pathname);
    console.log("parsed url query");
    console.log(parsedUrl.query);

    if (parsedUrl.pathname == '/StravaStatsHome.html') {

        // browser is asking for the main app. this implies one of the following
        //      user is invoking the app by trying to connect to it - need to authenticate
        //      user is navigating to the app via the Back or Forward button
        //      user hits Refresh on the browser while in the app
        //      user goes to a Bookmark that points to the app

        console.log("StravaStatsHome invoked");

        if (parsedUrl.query.code != undefined) {
            console.log("query parameter 'code' exists - complete authentication");

            // user is invoking the app by trying to connect to it

            // complete authentication
            performTokenExchange(response, parsedUrl.query.code);
            return;
        }
        else {
            filePath = 'public/StravaStatsHome.html';
        }
    }
    else if (parsedUrl.pathname == '/athleteActivities') {
        responseData.athleteId = parsedUrl.query.athleteId;
        listAthleteActivities(responseData);
        return;
    }
    else if (request.url == '/') {                                      // default to index.html
        filePath = 'public/index.html';
    } else {                                                            // serve static file
        parsedUrl = url.parse(request.url);
        filePath = "public" + parsedUrl.pathname;
    }
    var absPath = './' + filePath;
    console.log("absPath = " + absPath);
    serveStatic(response, cache, absPath);
});

server.listen(8080, function () {
    console.log("Server listening on port 8080.");
});


