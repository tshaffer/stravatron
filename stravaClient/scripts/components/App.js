import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SummaryActivitiesContainer from '../containers/summaryActivitiesContainer';

import * as mysql from '../services/mysqlServices';

export default class App extends Component {

    componentWillMount() {
        mysql.initDB();
    }

    componentDidMount() {
        
        console.log("app.js::componentDidMount invoked");

        // load visualization package for later use
        window.google.load("visualization", "1", { packages: ["corechart"] });
    }
    
    render() {

        return (
            <MuiThemeProvider>
                <SummaryActivitiesContainer />
            </MuiThemeProvider>
        );
    }
}


