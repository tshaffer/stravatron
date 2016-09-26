/**
 * Created by tedshaffer on 9/24/16.
 */
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

export function loadAthletes(dbServices) {

    return function (dispatch, getState) {

        // retrieve athletes from db - if none exist, add the defaults athletes
        let state = getState();
        const getAthletesPromise = dbServices.getAthletes();
        getAthletesPromise.then( athletes => {

            // if the athletes array is empty, add default athletes to db
            // this.dbServices.addAthlete("2843574", "fb8085cc4c7f3633533e875eae3dc1e04cef06e8", "Dad", "Ted", "Shaffer", "shaffer.family@gmail.com");
            // this.dbServices.addAthlete("7085811", "29ef6b106ea16378e27f6031c60a79a4d445d489", "Mom", "Lori", "Shaffer", "loriashaffer@gmail.com");
            // this.dbServices.addMap("Santa Cruz", "mapbox://styles/tedshaffer/citagbl4b000h2iqbkgub0t26");

            console.log(athletes);
            dispatch(setAthletes(athletes));
            state = getState();
        }, err => {

        });
    };
}

export function loadMaps() {

}