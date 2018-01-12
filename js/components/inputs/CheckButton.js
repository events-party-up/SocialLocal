import React, {Component} from 'react';

import {View, TouchableHighlight} from 'react-native';

import {Text} from 'native-base';

export default class CheckButton extends Component{

    static PropTypes ={
        active: React.PropTypes.bool,
        onPress: React.PropTypes.func,
        isDisabled:React.PropTypes.bool
    }

    constructor(props){
        super(props)
        this.state ={
            active: false,
            ...this.props
        }
    }
    
    onPress(){
        this.props.onPress(!this.state.active)
        this.setState({active: !this.state.active})
    }

    render(){
        const stylesbutton = this.state.active ? styles.activebutton: styles.inactivebutton
        const stylestext  = this.state.active ? styles.activetext: styles.inactivetext

        return(
            <TouchableHighlight 
                style={Object.assign({},stylesbutton, this.props.style)} 
                onPress={this.props.isDisabled ? null: () => this.onPress()}
                underlayColor= '#77CAF1'
            >
                <View style={{flex: 1, justifyContent:'center'}}>
                    <Text style={stylestext}>{this.state.active ? 'INVITED': 'INVITE'}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles={
    inactivebutton:{
        backgroundColor:'transparent',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 100,
        height: 32,
        width: 89,
        borderColor: '#77CAF1'
    },
    activebutton:{
        backgroundColor:'#77CAF1',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 100,
        height: 32,
        width: 89,
        borderColor: '#77CAF1'
    },
    inactivetext:{
        fontSize: 11,
        color:'#77CAF1',
        fontFamily:'worksans-medium',
        alignSelf:'center'
    },
    activetext:{
        fontSize: 11,
        color:'#FFF',
        fontFamily:'worksans-medium',
        alignSelf:'center'
    }
}