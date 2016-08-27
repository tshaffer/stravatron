import React, { Component } from 'react';

class SummaryActivities extends Component {

    showDetails() {
        console.log("showDetails() invoked");
    }

// <tr>
// <td>
// <input type='checkbox'/>
// </td>
// <td>
// 1/1/2016
// </td>
// <td>
// Arastradero
// </td>
// <td>
// 69 minutes
// </td>
// <td>
// 69 miles
// </td>
// <td>
// 69 feet
// </td>
// <td>
// 69 mph
// </td>
// <td>
// 69 calories
// </td>
// <td>
// <button onClick={this.showDetails.bind(this)}>Show details</button>
// </td>
// </tr>

    buildSummaryActivityRow(summaryActivity) {
        
        return (
            // <tr key={summaryActivity.id}>
            //     <td>herro</td>
            //     <td>kitty</td>
            // </tr>

            <tr key={summaryActivity.id}>
                <td>
                    <input type='checkbox'/>
                </td>
                <td>
                    1/1/2016
                </td>
                <td>
                    {summaryActivity.name}
                </td>
                <td>
                    69 minutes
                </td>
                <td>
                    69 miles
                </td>
                <td>
                    69 feet
                </td>
                <td>
                    69 mph
                </td>
                <td>
                    69 calories
                </td>
                <td>
                    <button onClick={this.showDetails.bind(this)}>Show details</button>
                </td>
            </tr>
        );
    }

    buildSummaryActivityRows() {

        var self = this;

        let summaryActivities = [];

        const activitiesLUT = this.props.summaryActivities.summaryActivitiesById;
        for (const key in activitiesLUT) {
            if (activitiesLUT.hasOwnProperty(key)) {
                summaryActivities.push(activitiesLUT[key]);
            }
        }

        let summaryActivityRows = summaryActivities.map(function(summaryActivity) {
            const summaryActivityRow = self.buildSummaryActivityRow(summaryActivity);
            return summaryActivityRow;
            // return (
            //     {summaryActivityRow}
            // );
            // return (
            //     <tr key={index}>
            //         <td>herro</td>
            //         <td>kitty</td>
            //     </tr>
            // );
        });
        return summaryActivityRows;

    }

    // number of summary activities is: {Object.keys(this.props.summaryActivities.summaryActivitiesById).length}
    render() {

        const summaryActivityRows = this.buildSummaryActivityRows();

        // number of summary activities is: {Object.keys(this.props.summaryActivities.summaryActivitiesById).length}
        return (
            <div id="SummaryActivities">
                <button type="button" id="btnCompareSelectedRides">Compare selected rides</button>
                <table id="activitiesTable">
                    <thead>
                        <tr>
                            <th/>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Riding Time</th>
                            <th>Distance</th>
                            <th>Elevation</th>
                            <th>Average Speed</th>
                            <th>Calories</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        {summaryActivityRows}
                    </tbody>
                </table>
            </div>
        );
    }
}

// <td>
//     <input id='" + activityId + "' type='submit' value='Show details'/>
// </td>

// <table id="activitiesTable">
//     <tr>
//         <th/>
//         <th>Date</th>
//         <th>Name</th>
//         <th>Riding Time</th>
//         <th>Distance</th>
//         <th>Elevation</th>
//         <th>Average Speed</th>
//         <th>Calories</th>
//         <th/>
//     </tr>
//
// </table>

SummaryActivities.propTypes = {
    summaryActivities: React.PropTypes.object.isRequired

    // activeBSEventType: React.PropTypes.string.isRequired,
    // propertySheetOpen: React.PropTypes.bool.isRequired,
    // onSelectTimeoutEvent: React.PropTypes.func.isRequired,
    // onSelectMediaEndEvent: React.PropTypes.func.isRequired,
    // onToggleOpenClosePropertySheet: React.PropTypes.func.isRequired
};

export default SummaryActivities;

// from stravaVS/public/StravaStatsHome.html
// function buildActivityRow(activity) {
//
//     //console.log("buildActivityRow invoked, activity is ");
//     //console.log(activity);
//
//     // activityName
//     var activityName = activity.name;
//
//     // athleteId
//     var athleteId = activity.athleteId;
//
//     // id
//     var activityId = activity.activityId;
//
//     // ride date
//     //d = new Date(activity.start_date_local);
//     var d = new Date(activity.startDateTime);
//     var date = d.toLocaleString();
//
//     // distance
//     var miles = activity.distance;
//
//     // riding time
//     var movingTime = getMovingTime(activity.movingTime);
//
//     // elevation gain
//     var elevationGain = activity.totalElevationGain;
//
//     // average speed (meters per second)
//     var mph = activity.averageSpeed;
//
//     var calories = activity.calories;
//
//     //rowToAdd = '<tr><td>' + date + '</td><td>' + activity.name + '</td><td>' + movingTime + '</td><td>' + miles.toFixed(0) + ' miles</td><td>' + elevationGain + ' ft</td><td>' + mph.toFixed(1) + ' mph</td><td>' + calories + '</td><td>' + "<input id='" + activityId + "' type='submit' value='Show details'/>" + '</td></tr>';
//     var rowToAdd = "<tr id='tr" + activityId + "'><td><input type='checkbox'/></td><td>" + date + '</td><td>' + activity.name + '</td><td>' + movingTime + '</td><td>' + miles.toFixed(0) + ' miles</td><td>' + elevationGain + ' ft</td><td>' + mph.toFixed(1) + ' mph</td><td>' + calories + '</td><td>' + "<input id='" + activityId + "' type='submit' value='Show details'/>" + '</td><td>' + "<input id='" + activityId + "-mapBuilder' type='submit' value='Map builder'/>" + '</td></tr>';
//     $('#activitiesTable').append(rowToAdd);
//
//     // add button handlers for this particular activity
//     var btnId = "#" + activityId;
//     $(btnId).click({ activityId: activityId, athleteId: athleteId, activityName: activityName, activity: activity }, showDetailsEventHandler);
//
//     btnId = "#" + activityId + "-mapBuilder";
//     $(btnId).click({ activityId: activityId, athleteId: athleteId, activityName: activityName, activity: activity }, mapBuilderInvokedEventHandler);
// }
//
// function buildActivitiesTable(activities) {
//
//     $("#activitiesTable input").unbind("click");
//
//     $.each(activities, function (index, activityElement) {
//         buildActivityRow(activityElement);
//     });
// }
