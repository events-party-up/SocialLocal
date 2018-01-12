import React, {Component} from 'react';

import {View, AlertIOS, TouchableHighlight} from 'react-native';

import {Text} from 'native-base';

export default class InviteButton extends Component{

    static PropTypes ={
        active: React.PropTypes.bool,
        onPress: React.PropTypes.func,
        isDisabled:React.PropTypes.bool,
        activeText: React.PropTypes.string,
        inactiveText: React.PropTypes.string,
        ctype: React.PropTypes.string
    }

    constructor(props){
        super(props)
        this.state ={
            active: false,
            ...this.props
        }
    }

    static defaultProps = {
        activeText:'INVITED',
        inactiveText: 'INVITED',
        isDisabled: false
    }

    _onPress(status){
        
        if(!this.props.isDisabled){
            this.setState({active: status})
            this.props.onPress(status)
        }
    }
    
    onPress(){
        // if ctype is specified
        const status = !this.state.active;

        switch(this.props.ctype){

            case 'addTime':
                AlertIOS.alert('ADD TIME', 
                    'Are you sure, you want to add 1 hour time?',
                    [{text: 'Cancel', onPress:()=> {}},
                    {text: 'Yes',  onPress:()=>this._onPress()}
                ])

                break;
            case 'going':
                 let message = status ?
                    "Are you sure you want to go?":
                    "Are you sure you don't want to go?"            

                AlertIOS.alert('CHANGE INVITATION',
                    message,
                    [{text: 'Cancel', onPress:()=> {}},
                     {text: 'Yes',  onPress:()=>this._onPress(status)}
                    ])
                    break;
            default:
                this._onPress(status)
        }
    }

    render(){
        const stylesbutton = this.state.active ? styles.activebutton: styles.inactivebutton
        const stylestext  = this.state.active ? styles.activetext: styles.inactivetext

        return(
            <TouchableHighlight 
                style={Object.assign({},stylesbutton, this.props.style)} 
                onPress={()=>this.onPress()}
                underlayColor= '#5F7EFE'
            >
                <View style={{flex: 1, justifyContent:'center'}}>
                    <Text style={stylestext}>{this.state.active ? this.props.activeText: this.props.inactiveText}</Text>
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
        width: 96,
        borderColor: '#5F7EFE'
    },
    activebutton:{
        backgroundColor:'#5F7EFE',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 100,
        height: 32,
        width: 96,
        borderColor: '#5F7EFE'
    },
    inactivetext:{
        fontSize: 11,
        color:'#5F7EFE',
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