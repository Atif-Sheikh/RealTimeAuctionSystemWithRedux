import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { signinAction } from '../store/action/action';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import "../App.css"
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loader: false,
        };
    };    
    signin = (e) => {
        e.preventDefault();
        const { email , password } = this.state;
        let user = {
            email,
            password,
        };
        this.props.signinWithEmailPassword(user);
        this.setState({loader: true})
        setTimeout(() => {
            this.setState({loader: false});
        }, 3000)
    };
    render() {
        return (
            <div>
                <div className="box">
                    <Paper style={styles.paper} zDepth={5}>
                        <h1 style={{color: 'rgba(0,0,0,0.7)'}}>Login</h1>
                        <form onSubmit={this.signin}>
                            <TextField hintText="Type your email here..." floatingLabelText="Email" type='email' name='email' value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} required />
                                <br />
                            <TextField hintText="Type your password here..." floatingLabelText="Password" type='password' name='password' value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} required />
                                <br />
                            <p style={styles.error}>{this.props.error}</p>
                            {
                                this.state.loader ? <LinearProgress style={{marginLeft: '5%',width: '90%'}} mode="indeterminate" /> : <RaisedButton label="Login" style={{margin: '20px'}} primary={true} type='submit' />
                            }<br />
                            <Link style={{textDecoration: 'none'}} to="/signup">
                                <span>Create Account ?</span>
                            </Link>
                        </form>
                    </Paper >
                </div >
            </div >
        );
    };
};

function mapStateToProp(state) {
    return ({
        // userName: state.root.userName
        error: state.root.error,
    });
};

function mapDispatchToProp(dispatch) {
    return ({
        // changeUserName: ()=>{dispatch(changeUserName())}
        signinWithEmailPassword: (user) => {
            dispatch(signinAction(user))
        }
    });
};
const styles = {
    paper: {
        height: "auto",
        width: 300,
        margin: 10,
        marginTop: '10%',
        padding: "10px",
        paddingBottom: '40px',
        textAlign: 'center',
        borderRadius: '20px',
        display: 'inline-block',
        // opacity: '0.7',
        // background: 'rgba(0,0,0,0.4)',
        background: '#795548',
        opacity: '0.9',
    },
    error: {
        color: 'red',
    },
};

export default connect(mapStateToProp, mapDispatchToProp)(Signin);