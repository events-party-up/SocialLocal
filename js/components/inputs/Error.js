import React, { Component } from 'react';

import {View, Text, AlertIOS } from 'react-native';
import {SHOW_ERROR, CLOSE_ERROR, closeError} from '../../actions/error';
import {Actions } from 'react-native-router-flux';
export default class Error extends Component{
    constructor(props){
        super(props);
        this.state ={
            errorState: CLOSE_ERROR,
            errorMessage: null,
            callback:null
        }
    }

    onPress(callback){

        Actions.pop();   
        if(callback)
            callback()
    }

   showError(error){
        const {message, title, callback } = this.props;  
        AlertIOS.alert(
                title,
                message,
                [{
                    text: 'OK', onPress: () => this.onPress(callback), style: 'ok' 
                }]
        )
    }

    componentDidMount(){
        this.showError(this.props.error);
    }

    render(){
        return (
            <View />
        );
    }
}