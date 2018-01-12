import React, { Component } from 'react';
import { connect } from 'react-redux';

import {View, Text, AlertIOS } from 'react-native';
import {SHOW_ERROR, CLOSE_ERROR, closeError} from '../../actions/error';

class Error extends Component{
    constructor(props){
        super(props);
        this.state ={
            errorState: CLOSE_ERROR,
            errorMessage: null,
            callback:null
        }
    }

    componentWillMount(){
        
        this.page = this.getPage(this.props)
    }

    onPress(callback){
        // clear the state variable
        this.props.closeError();
        
        callback && callback()
    }

    showError(error){
        const {errorState, errorMessage, callback} = error;
        if(errorState === SHOW_ERROR){
            AlertIOS.alert(
                'CUSTOM ALERT',
                errorMessage,
                [{
                    text: 'OK', onPress: () => this.onPress(callback), style: 'ok' 
                }]
        )}    
    }

    componentWillReceiveProps(nextProps, nextState){

        if(!_.isEqual(nextProps.error, this.props.error)){
            const {errorState, errorMessage,callback} = nextProps.error;
            this.setState({ errorState,errorMessage,callback })
        }
    }

    getPage(props){
        const index = props.navigation.index;

        return props.navigation.routes[index];
    }

    shouldComponentUpdate(nextProps, nextState){
        const currentPage = this.getPage(nextProps);
        if(currentPage === this.page)
            return true;
        return false;
    }

    componentDidUpdate(){
        
        this.showError(this.state);
    }
    render(){
        return (
            <View {...this.props} >
                {this.props.children}
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    closeError: () => dispatch(closeError())
})

const mapStateToProps = (state) => ({
    error: state.error,
    navigation: state.cardNavigation
});


export default connect(mapStateToProps, mapDispatchToProps)(Error)