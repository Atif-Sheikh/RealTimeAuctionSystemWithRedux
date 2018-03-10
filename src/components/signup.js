import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signupAction } from '../store/action/action';
import { Link } from 'react-router-dom'
import "../App.css"
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            userName: '',
            password: '',
            confirmPassword: '',
            loader: false,
        };
    };
    
    signup = (e) => {
        e.preventDefault();
        const { email, userName, password, confirmPassword } = this.state;
        let user = {
            email,
            userName,
            password,
            confirmPassword,
            Admin: false,
        };
        if (password === confirmPassword && email.trim() && userName.trim()) {
            this.props.signupwithEmailPassword(user);
            this.setState({loader: true});
        }
        else{
            alert("Password Does not Match")
        };
        this.setState({
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
    };
    render() {
        return (
            <div>
                <div className="box">
                    <Paper style={styles.paper} zDepth={5}>
                        <div>
                            <h1 style={{color: 'rgba(0,0,0,0.5)'}}>Signup</h1>
                            <form onSubmit={this.signup}>
                                <TextField hintText="Type your name here..." floatingLabelText="User Name" type='text' name='username' value={this.state.userName} onChange={(e) => this.setState({userName: e.target.value})} required />
                                    <br />
                                <TextField hintText="Type your email address here..." floatingLabelText="Email" type='email' name='email' value={this.state.email} onChange={(e) => {this.setState({email: e.target.value})}} required />
                                    <br />
                                <TextField hintText="Type your password here..." floatingLabelText="Password" type='password' name='password' value={this.state.password} onChange={(e) => {this.setState({password: e.target.value})}} required />
                                    <br />
                                <TextField hintText="Confirm your password here..." floatingLabelText="Confirm Password" type='password' name='confirmPassword' value={this.state.confirmPassword} onChange={(e) => {this.setState({confirmPassword: e.target.value})}} required />
                                    <br />
                                <p style={styles.error}>{this.props.signpError}</p>
                                {
                                    this.state.loader ? <LinearProgress style={{marginLeft: '5%',width: '90%'}} mode="indeterminate" /> : <RaisedButton label="Signup" style={{margin: '20px'}} primary={true} type='submit' />
                                    
                                }
                                    <br />
                                <Link style={{textDecoration: 'none'}} to="/">
                                    <span>Already have an Account ?</span>
                                </Link>
                            </form>
                        </div>
                    </Paper >
                </div>
            </div >
        );
    };
};

function mapStateToProp(state) {
    return ({
        // userName: state.root.userName
        signpError: state.root.signupError,        
    })
}
function mapDispatchToProp(dispatch) {
    return ({
        // changeUserName: ()=>{dispatch(changeUserName())}
        signupwithEmailPassword: (userDetails) => {
            dispatch(signupAction(userDetails));
        }
    });
};
const styles = {
    paper: {
        height: "auto",
        borderRadius: '20px',
        paddingBottom: '30px',
        width: 350,
        margin: 20,
        marginTop: '5%',
        padding: "10px",
        textAlign: 'center',
        display: 'inline-block',
        // background: 'rgba(0,0,0,0.4)',
        background: '#795548',
        opacity: '0.9',        
    },
    floatingLabelStyle: {   
        textAlign : 'left',        
    },
    error: {
        color: 'red',
    },
};

export default connect(mapStateToProp, mapDispatchToProp)(Signup);

