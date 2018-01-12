import React, {Component} from 'react';
import * as utils from './helpers';
import {StyleSheet, View,TouchableHighlight, Modal} from 'react-native';

import {NativeBaseComponent, Text, InputGroup, Icon, Input, Grid, Row, Col} from 'native-base';
import CountryPickComponent from 'react-native-country-picker-modal';
import FormInput from './index';



export default class CountryPicker extends Component{


    static propTypes = {
        ctype: React.PropTypes.string.isRequired,
        
        onChangeText: React.PropTypes.func,
        showError: React.PropTypes.bool,
        onComponentMounted: React.PropTypes.func
    }

    static defaultProps = {
        showError: true   
    }

    constructor(props){
        super(props);
        this.state= {
            input: '',
            valid: undefined,
            message: '',
            country: {
                callingCode: '1',
                name: 'United States',
                cca2: 'US'
            },
            modalVisible: false
        }
    }

    setModalVisible(visible){
        this.setState({modalVisible: visible})
    }

    //onChange Event
    handleChange(text){
        
        const phoneNumber = '+' + this.state.country.callingCode + text;
        this.props.onChangeText(phoneNumber);
        this.setState({input: text})
    }

    validate(){
        let value = this.state.input;
        
        return this.isValid(value);
    }

    clearInput(){
        this.input._textInput.setNativeProps({text: ''});
        this.setState({input: '', valid:true, message: ''});
        this.input._textInput.focus();
    }

    // validationFunction

    
    isValid(input){
        
        // check the same valid_<Ctype> method in utils folder
        let key = 'validate_'+ this.props.ctype;
        
        if (utils.hasOwnProperty(key)){
            
            let validate = utils[key];
            
            return validate(input)
                .then((res) => this.setState({valid: true, message: '' }))
                .catch(error => this.setState({valid: false, message: error.message}))
        }
    }

    componentDidMount(){
        // register this component
        
        if(this.props.onComponentMounted)
            this.props.onComponentMounted(this);
    }
    getError(){
        if(this.state.valid === false && this.props.showError)
            return (<Text style={styles.errorText}> {this.state.message} </Text>
        );
    }

    getIcon(){
        
        switch(this.state.valid){
            case true:
                return <Icon name = 'ios-checkmark-circle-outline' style={{color:'#77CAF1'}} />
            case false:
                return <Icon name='ios-close-circle-outline' style={{color:'#77CAF1'}} onPress={this.clearInput.bind(this)} />
            case undefined:
                return null;
            
        }
    }
    

    render(){
        
        return(
            <View keyboardShouldPersistTaps="always" style={this.props.style}>
             <Grid>
             <Row>
             <Col size={4}>
                 <CountryPickComponent
                    ref={countryPicker => this.countryPicker = countryPicker}
                    onChange={(value)=> this.setState({country: value}, () => this.handleChange(this.state.input))}
                    cca2={this.state.country.cca2}
                    closeable
                 >
                 <InputGroup iconRight style={{justifyContent:'center'}}>
                    <Input 
                        style={{fontSize:14, color: '#333333', fontFamily: 'worksans-regular'}}
                        value={this.state.country.name}
                        onFocus={()=> this.countryPicker.openModal()}
                    />
                    <Icon name = 'ios-arrow-forward' onPress={()=> this.countryPicker.openModal()}/>
                </InputGroup>
                </CountryPickComponent>
            </Col>
            
             </Row>
            <Row style={{marginTop: 15}}>
                <Col size={.7}>
                    <View style={{flex:1, justifyContent:'flex-end', paddingBottom: 9 ,alignItems:'center',borderColor:'#e7e8ea',borderRightWidth:1, borderBottomWidth: 1}}>
                        <Text style={{color: '#333333', fontSize: 14,fontFamily: 'worksans-regular'}}>+{this.state.country.callingCode}</Text>
                    </View>
                </Col>
                <Col size={3} style={{borderColor:'#e7e8ea', height: 55}}>
                <FormInput style={{paddingLeft: 10, marginTop: 1}}
                    icon="ios-unlock-outline"
                    onChangeText={input => this.handleChange(input)}
                    ctype='phone'
                    secureTextEntry={false}
                    autoFocus={true}
                    keyboardType={'phone-pad'}
                    onComponentMounted={this.props.onComponentMounted}
                    title='Phone number'
              />
                </Col>
            </Row>
            </Grid>
            { this.props.showError && !this.state.valid && this.getError()}
            </View>
        );
    }
}

const styles = {
  errorText:{
    fontSize: 10,
    fontStyle: 'italic',
    color: 'red'
  },
  input: {
    marginTop: 3,
    paddingLeft: 10
  }
};