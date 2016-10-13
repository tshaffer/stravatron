import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import LandingContainer from '../containers/landingContainer';

export default class App extends Component {

    componentDidMount() {
        
        console.log("app.js::componentDidMount invoked");

        // load visualization package for later use
        window.google.load("visualization", "1", { packages: ["corechart"] });
    }
    
    render() {

        return (
            <MuiThemeProvider>
                <LandingContainer />
            </MuiThemeProvider>
        );
    }
}


