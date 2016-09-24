/**
 * Created by tedshaffer on 9/24/16.
 */
import MysqlServices from '../services/mysqlServices';

export const SET_DB = 'SET_DB';
export const SET_ATHLETES = 'SET_ATHLETES';
export const LOAD_MAPS = 'LOAD_MAPS';

export function setDB(db) {
    return {
        type: SET_DB,
        db
    };
}

function setAthletes(athletes) {
    return {
        type: SET_ATHLETES,
        athletes
    };
}

export function loadAthletes(mysql) {

    return function (dispatch, getState) {

        // retrieve athletes from db - if none exist, add the defaults athletes
        let state = getState();
        const getAthletesPromise = mysql.getAthletes();
        getAthletesPromise.then( athletes => {

            // if the athletes array is empty, add default athletes to db
            
            console.log(athletes);
            dispatch(setAthletes(athletes));
            state = getState();
        }, err => {

        });
    };
}

export function loadMaps() {

}