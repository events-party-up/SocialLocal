import React, {Component} from 'react';

import {View, AlertIOS, TouchableHighlight} from 'react-native';

import {Text} from 'native-base';

import {capitalize} from '../../helpers/utils';

export default class ActionFFButton extends Component{

    static PropTypes ={
        userName: React.PropTypes.string,
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
        activeText:'Following',
        inactiveText: 'Follow',
        isDisabled: false,
    }

    _onPress(status){
        
        if(!this.props.isDisabled){
            
            this.setState({active: status})
            this.props.onPress(status)
        }
    }
    onCancel(){
        console.log("cancelling");
    }
    
    onPress(){

      const status = !this.state.active;

      // if ctype specified
      if(this.state.active){
        switch(this.props.ctype){

            case 'follow':
              AlertIOS.alert('Unfollow '+capitalize(this.props.userName), 
                     'Are you sure you want to unfollow?',
                     [{text: 'Cancel', onPress: this.onCancel},
                     {text: 'Yes',  onPress:()=>this._onPress(status)}
                 ])
            break;

            case 'block':
              AlertIOS.alert('Unblock '+capitalize(this.props.userName), 
                     'Are you sure you want to unblock?',
                     [{text: 'Cancel',  onPress: this.onCancel},
                     {text: 'Yes',  onPress:()=>this._onPress(status)}
                 ])
            break;

            case 'remove':
                AlertIOS.alert('Remove '+capitalize(this.props.userName), 
                     'Are you sure you want to remove invitation ?',
                     [{text: 'Cancel' , onPress: this.onCancel},
                     {text: 'Yes',  onPress:()=>this._onPress(status)}
                 ])
            break;

            default:
             this._onPress(status);
            break;
          }
        }
        else{
            switch(this.props.ctype){
                case 'invite':
                     AlertIOS.alert('Invite '+capitalize(this.props.userName), 
                     'Are you sure you want to invite?',
                     [{text: 'Cancel', onPress:()=> {}},
                     {text: 'Yes',  onPress:()=>this._onPress(status)}
                    ])
                    break;
                default:
                    this._onPress(status);
                    break;
            }

          //this._onPress(status);  
        }
    }


    render(){
        let stylesbutton = this.state.active ? styles.activebutton: styles.inactivebutton
        let stylestext  = this.state.active ? styles.activetext: styles.inactivetext

        return(
            <TouchableHighlight 
                style={_.assign({},stylesbutton,this.props.style)} 
                onPress={()=>this.onPress()}
                underlayColor= '#77CAF1'
            >
                <View style={{flex: 1, justifyContent:'center'}}>
                    <Text style={stylestext}>{this.state.active ? this.state.activeText: this.props.inactiveText}</Text>
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
        fontSize: 14,
        color:'#5F7EFE',
        fontFamily:'worksans-medium',
        alignSelf:'center'
    },
    activetext:{
        fontSize: 14,
        color:'#FFF',
        fontFamily:'worksans-medium',
        alignSelf:'center'
    }
}
