import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { getUserName, submitBid, getBidders } from '../store/action/action';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

class Wrapper extends Component {
    constructor(){
    super();
        this.state = {
            open: false,
            bidderName: '',
            bid: 0,
            bidders: false,
            expired: false,
        };
    };
    componentWillMount(){
        this.props.getUID();
    };
    handleRequestClose = () => {
        this.setState({
          open: false,
        });
    };
    applyBid = () => {
        this.setState({open: true})
    };
    submitForm = (e) => {
        e.preventDefault();
        const { bid , bidderName } = this.state;
        if(bid && bidderName){
            let key = this.props.pushKeys[this.props.index];
            let UID = this.props.user.UID;
            this.props.submitData(bid, bidderName, key, UID);
        }else{
            alert('please enter all fields...');
        }
    };
    bidders = () => {
        let key = this.props.pushKeys[this.props.index];
        this.props.getBidders(key);
        this.setState({bidders: true});        
    };
    renderButton = (UID) => {
        const { date, month, year, /*hours, minutes*/ } = this.props.data;        
        let now = new Date();
        let newDate = now.getDate();
        let newMonth = now.getMonth();
        let newYear = now.getFullYear();
        // let newHours = now.getHours();
        // let newMinutes = now.getMinutes();
        // console.log(date, month, year, hours, minutes, newDate, newMonth, newYear, newHours, newMinutes);
                    //   9     2    2018   14      14        7         2       2018      11          56
        if(year <= newYear && month <= newMonth && date <= newDate){
            // console.log(year, month, date, hours, minutes, newMinutes);
            return <RaisedButton label="Bid Expired" disabled={true} />
        }
        else{
            if(UID === this.props.user.UID){
                return <RaisedButton label='View Bidders' onClick={this.bidders} primary={true} />
            }else{
                return <RaisedButton label='Bid' onClick={this.applyBid} primary={true} />
            }
        }
    };
    render(){
        const actions = [
            <FlatButton
              label="Close"
              primary={true}
              onClick={this.handleRequestClose}
            />,
        ];
        const { productName, amount, discription, date, month, year, hours, minutes, category, UID, pic } = this.props.data;
        // console.log(UID, imgPath);
        let endDate = `${date}-${month+1}-${year}`;
        let endTime = `${hours}:${minutes}`;
        return(
            <Paper style={styles.paper}>
                <h1>{productName}</h1>
                <img style={{width: 300, height: '150px'}} src={pic} />
                    <hr/>
                <p>Product Details: <span style={styles.highlight}>{discription}</span></p>
                <p>Category: <span style={styles.highlight}>{category}</span></p>
                <p>End Date: <span style={styles.highlight}>{endDate}</span></p>                
                <p>End Time: <span style={styles.highlight}>{endTime}</span></p>                
                <p>Amount: <span style={styles.highlight}>${amount}</span></p>
                {
                    this.renderButton(UID)                                                
                }
                <Dialog onRequestClose={this.handleClose} autoScrollBodyContent={true} actions={<FlatButton
                    label="Close"
                    primary={true}
                    onClick={()=> this.setState({bidders: false})}
                    />} 
                open={this.state.bidders}>
                    <Table>
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Bid</TableHeaderColumn>
                        </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                        {
                            this.props.bidders ? this.props.bidders.map((bidder, index) => {
                                return <TableRow key={index.toString()}>
                                    <TableRowColumn>{index+1}</TableRowColumn>
                                    <TableRowColumn>{bidder.bidder}</TableRowColumn>
                                    <TableRowColumn>${bidder.bid}</TableRowColumn>
                                </TableRow>
                            }) : 'loader'
                        }
                        </TableBody>
                    </Table>
                </Dialog>
                <Dialog modal={false} style={styles.dialog} actions={actions} open={this.state.open} onRequestClose={this.handleClose} autoScrollBodyContent={true} >
                    <form onSubmit={this.submitForm}>
                        <TextField
                            floatingLabelText="Enter Name..."
                            value={this.state.bidderName}
                            onChange={(e) => this.setState({bidderName: e.target.value.trim()})}
                        /><br />
                        <TextField
                            type='number'
                            value={this.state.bid}
                            onChange={(e) => this.setState({bid: e.target.value})}                            
                            floatingLabelText="Bidding rate..."
                        /><br />
                        <RaisedButton label="Bid" primary={true} type='submit' onClick={this.handleRequestClose} />
                    </form>
                </Dialog>
            </Paper>
        );
    };
};
function mapStateToProps(state){
    return({
        user: state.root.user,
        bidders: state.root.bidders,
    });
};
function mapDispatchToProps(dispatch){
    return({
        getUID: () => {
            dispatch(getUserName())
        },
        submitData: (bid, bidder, key, UID) => {
            dispatch(submitBid(bid , bidder, key, UID))
        },
        getBidders: (key) => {
            dispatch(getBidders(key))
        },
    });
};
const styles = {
    paper: {
        height: 'auto',
        padding: '5px',
        minWidth: 300,
        margin: 3,
        display: 'inline-block',
    },
    highlight: {
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.6)',
        fontSize: '20px',
    },
    dialog: {
        width: '50%',
        height: 'auto',
        marginLeft: '25%',
        contentAlign: 'center',
        textAlign: 'center',
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);