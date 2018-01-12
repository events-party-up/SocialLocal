import React , {Component} from 'react';
import {View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Animated, Easing} from 'react-native'
import flattenStyle from 'flattenStyle'
import {Button} from 'native-base'

const makeCancelable = (promise) => {
let hasCanceled_ = false;

const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
            hasCanceled_ ? null : resolve(val)
            );
    });

return {
    promise: wrappedPromise,
    cancel() {
        hasCanceled_ = true;
    },
};
}

 class Inner extends Component{
     render(){
         if(this.props.loading){
             return(
                 <ActivityIndicator animating={true} style={styles.centering} />
             )
         }
         return(
             <Text> {this.props.text} </Text>
         );
     }
 }


export default class AnimatedButtonNew extends Button{

    static defaultProps = {
        duration: 1000

    };

    constructor(props){
        
        super(props);
        
        this._width =  flattenStyle(props.style).width;
        this._height = flattenStyle(props.style).height;

        this.state = {
            loading: false,
            width : new Animated.Value(this._width),
            buttonState: this.props.buttonState,
        }
    }

    componentDidUpdate(prevProps, nextState){
       
        if(this.state.loading)
            this.animate();
        else
            this.state.width.setValue(this._width);
    }

    animate(){
        
        this.state.width.setValue(this._width);
        Animated.timing(
            this.state.width,
            {
                toValue: this._height,
                duration: this.props.duration,
                easing: Easing.quad
            }
        ).start();
    }

    componentWillUnmount(){
        if(this.callback){
            this.callback.cancel();
        }
    }

    _onPress(){
        
        if(this.state.loading)
            return;
        
        this.setState({
          loading: true
        });

        //necessary to change the state back to normal
        this.callback = makeCancelable(
                Promise.resolve(this.props.onPress()))

        this.callback.promise.then(() => this.setState({
                loading: false
        })).catch(() => this.setState({
            loading: false
        }))
    }

    render(){

        var incomingProps = this.prepareRootProps();

        const animatedStyle = {
          width: this.buttonWidth,
          opacity: this.opacity
        }

        var incomingPropsStyle = incomingProps.style;
        delete incomingProps.style
        
        return(
            <Animated.View {...incomingProps} style={Object.assign({},incomingPropsStyle, { width: this.state.width })}>
            <TouchableOpacity
                style={{flex: 1, alignSelf: 'stretch'}}
                onPress={() => this._onPress()}
            >
                <View style={styles.inner}>
                    <Inner loading={this.state.loading} text={this.props.title} />
                </View>
            </TouchableOpacity>
            </Animated.View>
        );
    }
}

const styles= {
     button:{
         justifyContent: 'center',
         width: 350,
         height: 40,
         alignItems: 'center',
         backgroundColor: 'green',
         borderRadius: 40,
     },
     inner:{
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center'
     },
       centering: {
     alignItems: 'center',
     justifyContent: 'center',
     padding: 8,
   },
 };