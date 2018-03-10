import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import { getUsers, deleteUser } from '../store/action/action';

class Users extends Component {
    componentWillMount(){
        this.props.getUsers();
    };
    render(){
        return(
            <div>
                <Paper style={styles.paper} zDepth={3}>
                    <h1>Users</h1>
                        <Table style={{background: '#5D4037', opacity: '0.9'}}>
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={{fontSize: '30px'}}>ID</TableHeaderColumn>
                            <TableHeaderColumn style={{fontSize: '30px'}}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={{fontSize: '30px'}}>Status</TableHeaderColumn>
                            <TableHeaderColumn style={{fontSize: '30px'}}>Remove</TableHeaderColumn>
                        </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                        {
                            this.props.users ? this.props.users.map((user, index) => {
                                return <TableRow key={index.toString()}>
                                    <TableRowColumn style={{fontSize: '20px'}}>{index+1} </TableRowColumn>  
                                    <TableRowColumn style={{fontSize: '20px'}}>{user.name}</TableRowColumn>
                                    <TableRowColumn style={{fontSize: '20px'}}>{user.email}</TableRowColumn>
                                    <TableRowColumn style={{fontSize: '20px'}}>
                                        <FlatButton label="Remove" primary={true} onClick={()=> this.props.deleteUser(user.UID)} />
                                    </TableRowColumn>
                            </TableRow>
                            }) : '' 
                        }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    };
};

function mapStateToProps(state){
    return({
        users: state.root.users,
    });
};
function mapDispatchToProps(dispatch){
    return({
        getUsers: () => {
            dispatch(getUsers())
        },
        deleteUser: (UID) => {
            dispatch(deleteUser(UID))
        },
    });
};

const styles = {
    paper: {
        height: 'auto',
        width: '90%',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        background: '#5D4037', 
        opacity: '0.9',
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);