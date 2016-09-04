import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SummaryActivitiesContainer from '../containers/summaryActivitiesContainer';

export default class App extends Component {

    componentDidMount() {
        
        console.log("app.js::componentDidMount invoked");

        // load visualization package for later use
        google.load("visualization", "1", { packages: ["corechart"] });
    }
    
    render() {

        return (
            <MuiThemeProvider>
                <SummaryActivitiesContainer />
            </MuiThemeProvider>
        );
    }
}


