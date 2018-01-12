import React, {Component} from 'react';
import * as utils from './helpers';
import {StyleSheet, View, Switch,TextInput,Image} from 'react-native';

import {NativeBaseComponent, Picker, Text, InputGroup, Icon, Input} from 'native-base';
import baseStyle from '../../themes/base-styles';
import {locations,DURATION ,ADD_DURATION} from '../../helpers/constants';
import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal';

const nextScreen = require('../../../images/Next-Screen.png');
export default class FormInput extends Component{


    static propTypes = {
        ctype: React.PropTypes.string.isRequired,
        secureTextEntry: React.PropTypes.bool,
        onChangeText: React.PropTypes.func,
        showError: React.PropTypes.bool,
        onComponentMounted: React.PropTypes.func,
        style: React.PropTypes.object
    }

    static defaultProps = {
        showError: true,
        autoFocus: false,
        secureTextEntry: false,
        autoCapitalize:'none',
        keyboardType:'default',
        disabled:false,
        autoCorrect:false,
    }

    constructor(props){
        super(props);
        this.state= {
            input: this.props.value || "",
            countryData: undefined,
            valid: undefined,
            message: '',
            switchState: false,
            height:15
        }
    }

    //onChange Event
    handleChange(text){
        this.props.onChangeText(text);
        this.setState({input: text});
    }

    //locationchange
    handleLocation(data){
        this.props.onChangeText(data.cca2);
        this.setState({input: data.cca2, countryData: data})
    }

    validate(){
        let value = this.state.input;
        
        // aynchronus call
        
        return new Promise((resolve, reject) => 
            this.isValid(value)
                .then((res) => {this.setState({valid: true, message: '' }); resolve()})
                .catch(error => {this.setState({valid: false, message: error.message}); reject(error)})
        )
    }

    clearInput(){
        this.input._root.clear();
        this.setState({input: '', valid:undefined, message: ''});
        this.input._root.focus();
    }

    // validationFunction
    isValid(input){

        // check the same valid_<Ctype> method in utils folder
        let key = 'validate_'+ this.props.ctype;
        if (utils.hasOwnProperty(key)){
            let validate = utils[key];
            return validate(input)
        }
        return Promise.resolve({});
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
                return <Icon name = 'ios-checkmark-circle-outline' style={{color:'#5F7EFE', paddingRight: 16}} />
            case false:
                return <Icon name='ios-close-circle-outline' style={{color:'#5F7EFE', paddingRight: 16}} onPress={this.clearInput.bind(this)} />
            case undefined:
                return null;
            
        }
    }

    getTitleBox(title, style){
        if(title){
            return <Text style={_.assign({}, style, styles.subTitle)}>{title} </Text>;
        }
    }
    getTextInputBox(){
        return(
            <View keyboardShouldPersistTaps="always">
             {this.getTitleBox(this.props.title, this.props.style)}
             <InputGroup error={this.state.valid === false} iconRight disabled={this.props.disabled}>
                <Input
                    style={_.assign({},this.props.style,styles.textStyle,{height: Math.max(35, this.state.height)}) }
                    placeholder={this.props.placeholder}
                    secureTextEntry={ this.props.secureTextEntry }
                    autoCapitalize={this.props.autoCapitalize}
                    autoFocus={this.props.autoFocus}
                    autoCorrect={this.props.autoCorrect}
                    ref={(val) => {this.input = val;}}
                    value={this.props.value}
                    onEndEditing={() => this.validate().catch(() => {})}
                    onChangeText={(text) => this.handleChange(text)}
                    type="Input"
                    multiline={this.props.multiline}
                    keyboardType={this.props.keyboardType}
                    returnKeyType="next"
                    editable={!this.props.disabled}
                    onContentSizeChange={(w)=> this.setState({height:w.nativeEvent.contentSize.height}) }
                />
                {this.getIcon()}
            </InputGroup>
                {this.getError()}
            </View>
        );
        <Input
                    style={_.assign({},styles.textStyle,this.props.style,{height: Math.max(35, this.state.height)}) }
                    placeholder={this.props.placeholder}
                    secureTextEntry={true}
                    type="Input"
                    value={this.props.value}
                    autoFocus={this.props.autoFocus}
                    autoCorrect={this.props.autoCorrect}
                    autoCapitalize={this.props.autoCapitalize}
                    keyboardType={this.props.keyboardType}
                    returnKeyType="next"
                    ref={(val) => {this.input = val;}}
                    onEndEditing={() => this.validate().catch(() => {})}
                    onChangeText={(text) => this.handleChange(text)}
                    multiline={true}
                    onContentSizeChange={(w)=> this.setState({height:w.nativeEvent.contentSize.height}) }
                />
    }

    getShareBox(){
        return(
            <View keyboardShouldPersistTaps="always">
                <View style={styles.sharebox}>
                    <View style={{flex: 1, flexDirection:'row', alignItems:'center'}}>
                        <Icon name= {this.props.icon}/>
                        <Text style={Object.assign({},baseStyle.regularText,{fontSize:17, marginLeft: 7})}> {this.props.title} </Text>
                    </View>
                    <Switch
                        onValueChange={(value) => {  this.setState({switchState: value}); 
                                                 this.handleChange(value)}
                                              }
                        value={this.state.switchState} />
                    </View>
                
            </View>
        )
    }

    getPickerItems(){
        return _.map(locations,(loc)=>
            <Picker.Item label={loc.city} key={loc.key} value={loc.key} />
        )
    }
    getTimePickerItems(duration){
        return _.map(duration,(loc)=>
            <Picker.Item key={loc.key} label={loc.time} value={loc.value} />
        )
    }

    getLocation(){
        // find the index of the city this.state.input
        let index = _.find(locations,{city: this.state.input})
        // this will select a default location if value is not set
        if(!index)
            index = locations[0];

        return(
               <View keyboardShouldPersistTaps="always">
                <Text style={{fontWeight:'100', fontSize:11, paddingLeft: 16,color: '#9B9B9B'}}>{this.props.title}   </Text>
                <Picker
                     iosHeader="Select Location"
                     mode="dropdown"
                     selectedValue={index.key}
                     textStyle={{fontSize: 14, fontWeight: '400', fontFamily: 'worksans-regular', color: '#333333'}}
                     onValueChange={(val) => {
                         let city = _.find(locations,{key: val});
                         this.handleChange(city.city)}
                     }>
                     {this.getPickerItems()}
                </Picker>
             </View>
        )

    }

    getDuration(){

        // find the index of the city this.state.input
        let index = _.find(this.props.duration,{value: this.state.input})
        // this will select a default location if value is not set
        if(!index)
            index = this.props.duration[0];
        return(
               <View style={{flexDirection:'row'}} keyboardShouldPersistTaps="always">

                        <Text style={{ alignSelf:'center',textAlign:'center',textAlignVertical:'center',paddingLeft:12,fontSize:14,color:'#333333'}}> {this.props.title} </Text>                
                        <View style={{flex:1,justifyContent:'flex-start'}}>
                        <Picker
                        style={Object.assign({},{flex:1,alignSelf:'stretch',justifyContent:'flex-end',height:50},this.props.style)}
                        textStyle={{color:'#333333',fontSize:14}}
                         iosHeader="Select Duration"
                         mode="dropdown"
                         selectedValue={index.value}
                         onValueChange={(val) => {
                             let duration = _.find(this.props.duration,{value: val});
                             this.handleChange(duration.value)}
                         }>
                         {this.getTimePickerItems(this.props.duration)}
                        </Picker>
                        </View>
                        <Image source={nextScreen} style={{marginRight:16,alignSelf:'center'}} name='ios-arrow-down' />    
             </View>
        )
    }

    getContent(){
        switch(this.props.ctype){
            case 'location':
                return this.getLocation();
            case 'share':
                return this.getShareBox();
            case 'duration':
                return this.getDuration();
            default:
                return this.getTextInputBox();
        }
    }

    render(){
        return this.getContent()
    }
}

const styles = {
  errorText:{
    fontSize: 10,
    fontStyle: 'italic',
    color: 'red',
    fontFamily: 'worksans-regular'
  },
  sharebox:{
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    padding: 20,
    alignItems:'center',
    borderBottomWidth:1,
    borderBottomColor:'#B2B2B2',
    borderStyle:'solid'
  },
  textStyle:{
    fontSize:14,
    marginLeft: -5,
    fontFamily: 'System',
    color: '#333333',
    fontFamily: 'worksans-regular'
  },
  subTitle:{
    textAlign:'left',
    marginTop:5,
    textAlignVertical:'center', 
    fontWeight:'400', 
    fontSize:11,
    color: '#9B9B9B',
    fontFamily: 'worksans-regular'
  }
}