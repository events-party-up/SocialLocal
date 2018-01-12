import React, {Component} from 'react';

import {View, SegmentedControlIOS, ActionSheetIOS , TouchableOpacity} from 'react-native';
import {NativeBaseComponent, Button, InputGroup, Icon, Input, Text, Grid, Row, Col} from 'native-base';
import Tabs from './tabs'
import CustomIcon from 'react-native-vector-icons/MaterialIcons';
import {Actions, ActionConst} from 'react-native-router-flux';

export default class Header extends Component{

    static contextTypes = {
      drawer: React.PropTypes.object
    }

    static PropTypes ={
        onSelect: React.PropTypes.func.isRequired,
        onAddButtonClicked: React.PropTypes.func,
        onLeftButtonClicked: React.PropTypes.func.isRequired
    }

    static defaultProps ={
        tabsList : ['Maps', 'List'],
        leftButtonEnabled: true,
        rightButtonEnabled: true,
        onAddButtonClicked: ()=>{},
        onLeftButtonClicked:null,
        leftButtonIcon: 'ios-menu',
        rightButtonIcon: 'ios-add',
        middleContentEnabled: true,
        title: null
    }

    constructor(props,context){
        super(props,context);
        this.state ={
            page: 'maps',
            selectedIndex: 0,
        }
        this.drawer = this.context.drawer;
         this.drawList = [

          {  icon: 'ios-clock-outline',
             text: 'Party on',
             onClicked : Actions.partyon
            },

            {icon: 'ios-calendar-outline',
             text: 'Create Event',
             onClicked : Actions.partyon
            }
        ]
    }

    _onBlurChange(event) {
        this.setState({blurActiveSegment: event.nativeEvent.selectedSegmentIndex})
    }

    _onBlurValueChange(value) {
        this.setState({blurBlurType: value})
        this.props.onSelect(value)
    }

        showActionSheet(){
      
      //return this.props.resetRoute('landingpage');
      let buttons = _.map(this.drawList,(val) => val.text);
      buttons.push('Cancel');

      ActionSheetIOS.showActionSheetWithOptions({
        options: buttons,
        cancelButtonIndex: buttons.length-1
      },
        (buttonIndex)=>{
          // call the callback
          this.drawList[buttonIndex] && 
          this.drawList[buttonIndex].onClicked && 
          this.drawList[buttonIndex].onClicked()
        }
      )
    }

    onTabChange(val){
        
        Actions[val]({type: ActionConst.REPLACE, index: this.index, event: this.props.event, eventId: this.props.eventId})
    }

    getMiddleContent(){
        if(this.props.title)
            return <Text style={{alignSelf:'flex-end',fontSize: 16}}>{this.props.title.toUpperCase()}</Text>
        else
        return(
           <SegmentedControlIOS
            style={{flex: 3,alignSelf:'center'}}
            values={this.props.tabsList}
            selectedIndex={this.props.index}
            onChange={(event) => {
                this.index = event.nativeEvent.selectedSegmentIndex
                
            }}
            onValueChange={(val) => this.onTabChange(val)}
            />
        )
    }

    getIcon(){
        if(this.props.leftButtonIcon === 'arrow-back'){
            return <CustomIcon name='arrow-back' size={26} color='#9B9B9B'/>
        }
        else{
            return <Icon name={this.props.leftButtonIcon}/>
        }
    }

    getLeftIcon(){
        return <TouchableOpacity style={{flex: 1}} >
           
        </TouchableOpacity>
        return <TouchableOpacity style={{flex: 1}} onPress={this.props.onLeftButtonClicked || this.drawer.toggle}>
            {this.getIcon()}
        </TouchableOpacity>
    }

    getRightIcon(){
        return <TouchableOpacity style={{flex: 1}} /    >
        return <TouchableOpacity style={{flex: 1}} onPress={this.showActionSheet.bind(this)}>
            { this.props.rightButtonEnabled && 
                <Icon name={this.props.rightButtonIcon} style={{justifyContent:'flex-end', alignSelf:'flex-end'}}/>}
        </TouchableOpacity>
    }

    getHeaderContent(){
        return(
            <View style={styles.header}>
                {this.getLeftIcon()}
                {this.getMiddleContent()} 
                {this.getRightIcon()}
            </View>
        )
    }

    render(){
        return this.getHeaderContent();
    }
}

const styles ={
    header:{
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-around',
        backgroundColor:'transparent',
        alignItems:'center',
        top:0,
        height: 64,
        right: 0,
        left: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#828287',
        position: 'absolute',
        padding:20
        
    }
}