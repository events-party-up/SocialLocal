import React, {Component} from 'react';
import * as utils from './helpers';
import {Animated, View, Easing } from 'react-native';


import {List, ListItem, Text, Icon} from 'native-base';
import baseStyle from '../../themes/base-styles';

const ReactNative = require('react-native');
const { StyleSheet, Dimensions, Platform } = ReactNative;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class boxdrawer extends Component{

    static PropTypes = {
        drawList: React.PropTypes.array,
        onChangeHeight: React.PropTypes.func,
    }

    constructor(props){
        super(props);
        this.state ={
            status: 'closed',
            open: false,
            maxHeight: 25
        }

        this.height = new Animated.Value(0)
        this.spring_config = {friction: 1, tension: 40}    
    }

    componentWillMount(){
        if(this.props.onChangeHeight)
            this.listener = this.height.addListener(this.props.onChangeHeight);
        
    }

    componentWillUnmount(){
        if(this.listener)
            this.height.removeListener(this.listener)
    }

    open(){
        this.setState({open: true})
        this.height.setValue(0);
        Animated.spring(this.height, {
            friction: 20,
            tension: 40,
            toValue: 1
        }).start();
    }

    closed(){
        
        this.height.setValue(1);
        Animated.timing(this.height, {
            duration: 1000,
            toValue: 0
        }).start(() => this.setState({open: false}));
    }

    toggle(){
        if(this.state.open){
            this.closed();
        }
        else{
            this.open();
        }
    }

    static defaultProps = {
        drawList: [
            {icon: 'ios-clock-outline',
             text: 'Demo',
             onClicked: () => console.log('clicked')
            },
            {icon: 'ios-calendar-outline',
             text: 'Demo',
             onClicked: () => console.log('clicked')
            },
        ]
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight   : this.state.maxHeight + event.nativeEvent.layout.height
        });
    }

    _renderMenuRow(item){
        
        return( 
            <ListItem onLayout={this._setMaxHeight.bind(this)} onPress={item.onClicked}>
                <View style={styles.container}>
                    <View style={styles.icon}>
                        <Icon name={item.icon}/>
                    </View>
                    <View style={styles.label}>
                        <Text style={baseStyle.regulartext}> {item.text} </Text>
                    </View>
                </View>
            </ListItem>
        );
    }

    getMenu(){
        
        return(
                
                <List 
                        dataArray={this.props.drawList}
                        renderRow={this._renderMenuRow.bind(this)}>
                </List>
        )
    }

    render(){
        let height = this.height.interpolate({
            inputRange:[0, 1],
            outputRange: [0, this.state.maxHeight]
        })
        
        // call the callback function with current height
        return(
            <Animated.View style={Object.assign({},styles.boxDrawer, {height})}> 
                {this.getMenu()}
            </Animated.View>
            
        )
    }
}


const styles = {
    container:{
        flex: 1, 
        flexDirection:'row',
        justifyContent: 'flex-start', 
        alignItems:'center'
    },
    boxDrawer:{
        backgroundColor:'#FFF',
        position:'absolute',
        top:0,
        left: 0,
        right: 0
    },
    icon:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        
    },
    label:{
        
        flex:4,
        alignItems:'center',
        justifyContent:'center'
    }
}