import React, { Component } from 'react';
import { Route, Router, Redirect } from 'react-router-dom';
import Home from './components/home.js';
import Signup from './components/signup';
import Signin from './components/signin';
import history from './History';
import * as firebase from 'firebase';

function PrivateRoute({ component: Component, authed, ...rest }){
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
        />
    );
};
class Routers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            authed: false
        };
    };
    componentWillMount() {
        let that = this
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // console.log(user)
                that.setState({
                    authed: true
                });
                let type = localStorage.getItem("type");
                let convertype = JSON.parse(type);
                if (convertype !== null) {
                    history.push(convertype);
                }
            }
            else {
                that.setState({
                    authed: false
                })
            }
        });
    };
    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={Signin} />
                    <Route path="/signup" component={Signup} />
                    <PrivateRoute authed={this.state.authed} path="/home" component={Home} />
                </div>
            </Router>
        )
    }
}


export default Routers;