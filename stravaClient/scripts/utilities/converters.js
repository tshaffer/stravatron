var moment = require('moment');

export function getMovingTime(moving_time) {

    const hours = Math.floor(moving_time / 3600);

    const minutes = Math.floor((moving_time - 3600 * hours) / 60);
    let minutesStr = minutes.toString();
    if (minutesStr.length == 1) {
        minutesStr = "0" + minutesStr;
    }

    const seconds = Math.floor(moving_time - (3600 * hours) - (60 * minutes));
    let secondsStr = seconds.toString();
    if (secondsStr.length == 1) {
        secondsStr = "0" + secondsStr;
    }

    let movingTime = "";
    if (hours > 0) {
        movingTime = hours + ':';
    }

    movingTime += minutesStr + ':' + secondsStr;
    return movingTime;
}

export function getDateTime(dateTime) {
    // var d = new Date(dateTime);
    // var date = d.toLocaleString();
    return new Date(dateTime).toLocaleDateString();
}

export function metersToMiles(meters) {
    return meters * 0.000621371;
}

export function metersToFeet(meters) {
    return meters * 3.28084;
}

export function metersPerSecondToMilesPerHour(speed) {
    return speed * 2.23694;
}

export function elapsedTimeToTimeString(elapsedTime) {
    if (elapsedTime == '') {
        return '';
    }

    return moment().startOf('day')
        .seconds(Number(elapsedTime))
        .format('mm:ss');
}

export function formatDate(date) {
    if (date == '') {
        return '';
    }

    return moment(date).format('YYYY-MM-DD');
}