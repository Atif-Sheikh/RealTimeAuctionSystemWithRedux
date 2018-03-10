import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { getUserName, submitBid, getBidders, deleteAuction } from '../store/action/action';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import deleteIcon from '../images/delete.png';
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
            fullImage: false,
        };
    };
    componentWillMount(){
        this.props.getUID();
    };
    handleRequestClose = () => {
        this.setState({
          open: false,
          fullImage: false,
        });
    };
    applyBid = () => {
        this.setState({open: true})
    };
    submitForm = (amount) => {
        // console.log(amount);
        const { bid , bidderName } = this.state;
        if(bid >= amount && bidderName){
            let key = this.props.pushKeys[this.props.index];
            let UID = this.props.user.UID;
            this.props.submitData(bid, bidderName, key, UID);
        }else{
            alert('please enter all fields correctly...');
        }
    };
    deleteAuction = () => {
        let key = this.props.pushKeys[this.props.index];
        this.props.deleteAuction(key);
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
        // console.log(this.props.user['Admin']);
        let endDate = `${date}-${month+1}-${year}`;
        let endTime = `${hours}:${minutes}`;
        return(
            <Paper style={styles.paper}>
                {
                    this.props.user['Admin'] ? <span>
                            <img style={styles.icon} alt='Delete' src={deleteIcon} onClick={this.deleteAuction} />
                        </span> : ''
                }
                <h1 style={{color: 'rgba(0,0,0,0.6)'}}>{productName}</h1>
                <img alt='ProductImage' style={{width: 300, height: '180px'}} onClick={()=> this.setState({fullImage: true})} src={pic} />
                <Dialog onRequestClose={this.handleClose} autoScrollBodyContent={true} actions={<FlatButton
                    label="Close"
                    primary={true}
                    onClick={()=> this.setState({fullImage: false})}
                    />} 
                open={this.state.fullImage}>
                    <img alt='ProductImage' style={{width: '100%', height: '1800%'}} onClick={()=> this.setState({fullImage: false})} src={pic} />
                </Dialog>
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
                    <form onSubmit={(e)=> {e.preventDefault(); this.submitForm(amount)}}>
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
        deleteAuction: (key) => {
            dispatch(deleteAuction(key))
        },
    });
};
const styles = {
    paper: {
        height: 'auto',
        padding: '2px',
        minWidth: 300,
        margin: 3,
        display: 'inline-block',
        background: 'rgba(0,0,0,0.2)',
    },
    highlight: {
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.6)',
        fontSize: '20px',
    },
    icon: {
        width: 40,
        height: 40,
        cursor: 'pointer',
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