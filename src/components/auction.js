import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { submitData } from '../store/action/action';
import { connect } from 'react-redux'; 

class Auction extends Component {
    constructor(props) {
    super(props);
    
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 1);
        minDate.setHours(0, 0, 0, 0);
        
        this.state = {
            productName: '',
            discription: '',
            minDate: minDate,
            endTime: '',
            category: 'Computer',
            amount: 0,
            error: '',
            route: false,
            img: '',
            imgValue: 0,
        };
    };
    handleChangeMinDate = (event, date) => {
        // console.log(date);        
        this.setState({
            minDate: date,
            error: '', 
        });
    };
    handleChange = (event, index, value) => {this.setState({category: value})};
    handleChangeTime = (event, time) => {
        // let today = `${time.getHours()}:${time.getMinutes()}`;
        // console.log(today);
        this.setState({
            endTime: time,
            error: '', 
        });
    };
    submitForm = (e) => {
        e.preventDefault();
        const { productName, discription, minDate, endTime, category, amount, img } = this.state;
        let today = new Date();
        if(minDate >= today){
            // console.log(minDate.getTime);
            let hours = endTime.getHours();
            let minutes = endTime.getMinutes();
            minDate.setHours(hours, minutes);
            // console.log(minDate);
            let date = minDate.getDate();
            let month = minDate.getMonth();
            let year = minDate.getFullYear();
            // let now = new Date(year, month, date, hours, minutes);
            let T = minDate.getTime();
            // console.log(T);
            // console.log(date, month, year, hours, minutes); 
            let obj = { productName, discription, category, date, month, year, hours, minutes, amount, img, T };
            this.props.submitData(obj);
            this.setState({route: true, img: ''});
        }else{
            this.setState({error: 'enter all fields carefully...'});
        };
    };
    render(){
        return(
            <div className={styles.main}>
                {
                    this.state.route ? <Paper style={{marginLeft: '25%', width: '50%', textAlign: 'center', marginTop: '10%', height: '50px', lineHeight: '50px'}} zDepth={1}>
                        <h2>Sucessfully Posted...</h2>
                        <RaisedButton onClick={()=> this.setState({route: false})} label='Post Another ?' primary={true} />
                    </Paper> : <Paper style={styles.paper} zDepth={1}>
                    <h2>Product Details</h2>
                    <form onSubmit={this.submitForm}>
                        <TextField
                            style={styles.field}
                            floatingLabelText="Product Name"
                            required
                            onChange={(e)=> this.setState({productName: e.target.value.trim(), error: ''})}                            
                        />
                        <TextField
                            floatingLabelText="Discription"
                            required                            
                            onChange={(e)=> this.setState({error: '', discription: e.target.value.trim()})}                            
                        />
                        <DatePicker
                            floatingLabelText="Auction End Date"
                            autoOk
                            required                            
                            minDate={this.state.minDate}
                            onChange={this.handleChangeMinDate}
                        />
                        <TimePicker
                            hintText='Auction End Time'
                            autoOk={true}
                            required                            
                            onChange={this.handleChangeTime}
                        />
                        <span style={{position: 'relative', top: '-22px'}}>Select Category:</span><DropDownMenu style={{lineHeight: '60px'}} value={this.state.category} onChange={this.handleChange}>
                            <MenuItem value='Computer' primaryText='Computer' />
                            <MenuItem value='Mobile' primaryText='Mobile' />
                            <MenuItem value='Camera' primaryText='Camera' />
                            <MenuItem value='Other' primaryText='Other' />
                        </DropDownMenu>
                        <progress style={styles.progress} value={this.state.imgValue} max='100' />
                        <input required='required' type='file' onChange={(e) => this.setState({img: e.target.files[0], imgValue: 100})} />
                        <TextField
                            type='number'
                            floatingLabelText="Starting Amount"
                            required
                            onChange={(e)=> this.setState({error: '', amount: e.target.value})}
                        /><br />
                        <p style={{color: 'red'}}>{this.state.error}</p>
                        <RaisedButton type='submit' label="Submit" primary={true} />
                    </form>
                </Paper>
                }
            </div>
        );
    };
};

const styles = {
    main: {
        width: '100%',
        height: 'auto',
    },
    paper: {
        width: 400,
        height: 'auto',
        padding: '10px',
        borderRadius: '20px',        
        marginLeft: '30%',
        marginTop: '2%',
        textAlign: 'center',
        display: 'inline-block',
        // background: 'rgba(0,0,0,0.8)'
        background: '#795548',
        opacity: '0.9',
    },
    progress: {
        width: '66.5%', 
        height: '10px', 
        margin: '8px',
    },
};
function mapStateToProps(state){
    return({
        
    });
};

function mapDispatchToProps(dispatch){
    return({
        submitData: (obj) => {
            dispatch(submitData(obj))
        },
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(Auction);