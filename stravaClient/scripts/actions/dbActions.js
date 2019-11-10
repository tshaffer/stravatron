/**
 * Created by tedshaffer on 9/24/16.
 */
export const SET_DB = 'SET_DB';
export const SET_ATHLETES = 'SET_ATHLETES';
export const LOAD_MAPS = 'LOAD_MAPS';

function setDB(dbServices, dbConnection) {
  return {
    type: SET_DB,
    dbServices,
    dbConnection
  };
}

function setAthletes(athletes) {
  return {
    type: SET_ATHLETES,
    athletes
  };
}

export function loadDBData(dbServices, dbConnection) {
  return function (dispatch) {
    // dispatch(setDB(dbServices, dbConnection));
    dispatch(loadAthletes(dbServices));
    dispatch(loadSelectedAthlete(dbServices));
  };
}

function loadAthletes(dbServices) {

  return function (dispatch) {

    const athletes = [];
    athletes.push( {
      id: '2843574',
      name: 'Dad',
      firstName: 'Ted',
      lastName: 'Shaffer',
      email: 'shaffer.family@gmail.com',
      accessToken: 'fb8085cc4c7f3633533e875eae3dc1e04cef06e8',
    })
    console.log(athletes);
    dispatch(setAthletes(athletes));

    // retrieve athletes from db - if none exist, add the defaults athletes
    // const getAthletesPromise = dbServices.getAthletes();
    // getAthletesPromise.then( athletes => {

    //   // if the athletes array is empty, add default athletes to db
    //   // this.dbServices.addAthlete("2843574", "fb8085cc4c7f3633533e875eae3dc1e04cef06e8", "Dad", "Ted", "Shaffer", "shaffer.family@gmail.com");
    //   // this.dbServices.addAthlete("7085811", "29ef6b106ea16378e27f6031c60a79a4d445d489", "Mom", "Lori", "Shaffer", "loriashaffer@gmail.com");
    //   // this.dbServices.addMap("Santa Cruz", "mapbox://styles/tedshaffer/citagbl4b000h2iqbkgub0t26");

    //   console.log(athletes);
    //   dispatch(setAthletes(athletes));
    // }, err => {
    //   console.log(err, " loadAthletes");
    // });
  };
}

function loadSelectedAthlete(dbServices) {

  return function (dispatch) {

    const selectedAthlete = {
      id: '2843574',
      name: 'Dad',
      firstName: 'Ted',
      lastName: 'Shaffer',
      email: 'shaffer.family@gmail.com',
      // accessToken: 'fb8085cc4c7f3633533e875eae3dc1e04cef06e8',
      accessToken: '2ae6c4040243728ff81f9f0dcccfb7580ce0de1d',
    };
    dispatch(setSelectedAthlete(selectedAthlete));
    // retrieve selectedAthlete from db
    // const getSelectedAthletePromise = dbServices.getSelectedAthlete();
    // getSelectedAthletePromise.then( selectedAthlete => {
    //   console.log(selectedAthlete);
    //   dispatch(setSelectedAthlete(selectedAthlete));
    // }, err => {
    //   console.log(err, " loadAthletes");
    // });
  };
}

export function loadMaps() {

}