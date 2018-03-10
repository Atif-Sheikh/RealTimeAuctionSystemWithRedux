import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import { getData } from '../store/action/action';
import Wrapper from './wrapper';
import RefreshIndicator from 'material-ui/RefreshIndicator';

class Biddings extends Component {
    componentWillMount(){
        this.props.getData();
    };
    render(){
        // console.log(this.props.arrData);
        // console.log(this.props.keys);        
        return(
            <div>
                {
                    this.props.arrData ? <Paper style={styles.paper} zDepth={1}>
                    {
                        this.props.arrData.map((data, index) => {
                            return <Wrapper pushKeys={this.props.keys} data={data} index={index} key={index.toString()}/>
                        })
                    }
                    </Paper> : <RefreshIndicator size={100} left={600} top={200} loadingColor="#FF9800" status="loading" style={styles.refresh} />
                }
            </div>
            
        );
    };
};
function mapStateToProps(state){
    return({
        arrData: state.root.data,
        keys: state.root.keys
    });
};
function mapDispatchToProps(dispatch){
    return({
        getData: () => {
            dispatch(getData())
        },
    });
};

const styles = {
    paper: {
        maxHeight: '600px',
        width: '90%',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        overflowY: 'scroll',
        background: 'rgba(0,0,0,0.4)',
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(Biddings);