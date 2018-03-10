import React, { Component } from 'react';
// import * as firebase from 'firebase';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
// import history from '.././History';
import { connect } from 'react-redux';
import { logoutAction, getUserName } from '../store/action/action';
import Auction from './auction';
import Biddings from './biddings';
import Users from './users';

class Home extends Component {
    constructor(){
    super();
        this.state = {
            name: '',
            email: '',
            uid: '',
            auctioneer: true,
            bidder: false,
            users: true,
        };
    };
    componentWillUpdate(){
        localStorage.setItem('type', JSON.stringify('/home'));
    };
    logout = (e) => {
        e.preventDefault();
        this.props.logout();
        // firebase.auth().signOut()
        //     .then(()=>{
        //         history.push('/');
        //     })
        //     .catch((e)=>{
        //         console.log(e);
        //     });
    };
    handleToggle = () => {
        this.setState({open: !this.state.open});
    };
    handleClose = () => {
        this.setState({open: false});
    };
    componentWillMount(){
        this.props.getUserName();
    };
    render(){ 
        return(
            <div>
                <AppBar
                    title={<span style={styles.title}>{this.props.user ? this.props.user.name : ''}</span>}
                    onLeftIconButtonClick={this.handleToggle}
                    iconElementRight={<FlatButton onClick={this.logout} label="LogOut" />}
                    style={{background: '#795548', opacity: '0.9'}}
                >
                    <span style={styles.heading}>Real Time Auction System</span>
                </AppBar>
                {
                    this.props.user.Admin ? <div>
                        <Drawer containerStyle={{background: '#F0F4C3'}}
                        docked={false}
                        width={200}
                        open={this.state.open}
                        onRequestChange={(open) => this.setState({open})}
                    >
                        <MenuItem onClick={()=> this.setState({open: false, users: true, bidder: false})}>Users</MenuItem>
                        <MenuItem onClick={()=> this.setState({open: false, users: false, bidder: true})}>Bidders</MenuItem>                
                    </Drawer>
                    <div>
                        {
                            this.state.users ? <div>
                                <Users />
                            </div> : ''
                        }
                        {
                        this.state.bidder ? <div>
                                <Biddings />
                            </div> : ''
                        }
                    </div>
                </div> : <div>
                            <Drawer
                            docked={false}
                            width={200}
                            open={this.state.open}
                            onRequestChange={(open) => this.setState({open})}
                        >
                            <MenuItem onClick={()=> this.setState({open: false, auctioneer: true, bidder: false})}>Auctioneer</MenuItem>
                            <MenuItem onClick={()=> this.setState({open: false, auctioneer: false, bidder: true})}>Bidder</MenuItem>                
                        </Drawer>
                        <div>
                            {
                                this.state.auctioneer ? <div>
                                    <Auction />
                                </div> : ''
                            }
                            {
                            this.state.bidder ? <div>
                                    <Biddings />
                                </div> : ''
                            }
                        </div>
                    </div>
                }
                </div>
        );
    };
};
const styles = {
    title: {
      cursor: 'pointer',
      float: 'left',
    },
    heading: {
        position: 'absolute', 
        marginLeft: '35%', 
        marginTop: '20px',
        fontSize: '25px',
    },
};

function mapStateToProp(state){
    return({
        user: state.root.user,
    });
};

function mapDispatchToProp(dispatch){
    return({
    //     changeUserName: ()=>{dispatch(changeUserName())}
        logout: () => {
            dispatch(logoutAction())
        },
        getUserName: () => {
            dispatch(getUserName())
        },
    });
};

export default connect(mapStateToProp, mapDispatchToProp)(Home);

