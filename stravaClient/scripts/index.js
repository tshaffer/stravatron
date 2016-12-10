require('../less/main.less');

'use strict';

import thunkMiddleware from 'redux-thunk';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import { Router, hashHistory } from 'react-router';
import reducers from './reducers';
import { Route } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './components/app';
import AllSummaryActivitiesContainer from './containers/allSummaryActivitiesContainer';
import SegmentsSummaryActivitiesContainer from './containers/segmentsSummaryActivitiesContainer';
import NearLocationSummaryActivitiesContainer from './containers/nearLocationSummaryActivitiesContainer';
import DetailedActivityContainer from './containers/detailedActivityContainer';
import ActivitySegmentCreatorContainer from './containers/activitySegmentCreatorContainer';
import MapOfRides from './components/mapOfRides';
import MapStarredSegments from './components/mapStarredSegments';

const store = createStore(
  reducers,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    ReduxPromise
  )
);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App} />
      <Route path="/allSummaryActivitiesContainer" component={AllSummaryActivitiesContainer} />
      <Route path="/segmentsSummaryActivitiesContainer/:id" component={SegmentsSummaryActivitiesContainer} />
      <Route path="/nearLocationSummaryActivitiesContainer/:targetRegion" component={NearLocationSummaryActivitiesContainer} />
      <Route path="/detailedActivityContainer/:id" component={DetailedActivityContainer} />
      <Route path="/activitySegmentCreatorContainer/:id" component={ActivitySegmentCreatorContainer} />
      <Route path="/mapOfRides/:ids" component={MapOfRides} />
      <Route path="/mapStarredSegments" component={MapStarredSegments} />
    </Router>
  </Provider>
  , document.getElementById('content'));
