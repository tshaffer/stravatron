import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { loadSummaryActivities } from '../actions/index';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            foo: null
        };
    }


    componentDidMount() {

        debugger;

        console.log("app.js::componentDidMount invoked");

        this.props.loadSummaryActivities();
    }

    render() {

        return (
            <MuiThemeProvider>
                <div>
                    pizza
                </div>
            </MuiThemeProvider>
        );
    }
}

function mapStateToProps (state) {
    return {
        foo: state.foo
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({loadSummaryActivities},
        dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

