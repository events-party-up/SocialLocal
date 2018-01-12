import React, {Component } from 'react';

import {View,Text,Animated} from 'react-native';
import * as helpers from './helpers';

export default class CountdownTimer extends Component{
    static propTypes = {
        initialTimeRemaining: React.PropTypes.number,
        event: React.PropTypes.object,
        interval: React.PropTypes.number,
        formatFunc: React.PropTypes.func,
        tickCallback: React.PropTypes.func,
        completeCallback:  React.PropTypes.func,
    }

    static defaultProps = {
        interval: 1000,
        initialTimeRemaining:  60*1000,
        formatFunc: null,
        tickCallback: null,
        completeCallback: null
    }

    constructor(props){
        super(props);

        let timeRemaining = 1000*60*60;
        
        if(this.props.event)
            timeRemaining = helpers.timeRemaining(this.props.event);

        this.state = {
            timeRemaining,
            timeoutId: null,
            prevTime: null
        }
    }

    componentDidMount(){
        this._mounted = true;
        this.tick()
    }

    componentWillReceiveProps(nextProps){
        if(this.state.timeoutId) clearTimeout(this.state.timeoutId);
        this.setState({prevTime: null, timeRemaining: helpers.timeRemaining(nextProps.event)})
    }

    componentDidUpdate(){
        if(!this.state.prevTime && this.state.timeRemaining > 0 && this.isMounted())
            this.tick();
    }

    componentWillUnmount(){
        clearTimeout(this.state.timeoutId);
        this._mounted = true;
    }

    isMounted(){
        return this._mounted;
    }

    tick(){
        
        let currentTime = Date.now()
        let dt = this.state.prevTime ? (currentTime - this.state.prevTime): 0
        let interval = this.props.interval

        // remaining time
        let timeRemainingInInterval = (interval - dt%interval)
        let timeout = timeRemainingInInterval;

        if(timeRemainingInInterval < (interval / 2.0)){
            timeout += interval;
        }

        let timeRemaining = Math.max(this.state.timeRemaining - dt, 0)
        let countDownComplete = (this.state.prevTime && timeRemaining <= 0)
        if(this.isMounted()){
            if(this.state.timeoutId){ clearTimeout(this.state.timeoutId)}
            this.setState({
                timeoutId: countDownComplete ? null: setTimeout(this.tick.bind(this), timeout),
                prevTime: currentTime,
                timeRemaining
            })
        }

        if(countDownComplete){
            this.props.countDownComplete && this.props.countDownComplete()
        }
    }

    getFormattedTime(milliseconds){
        var totalSeconds = Math.round(milliseconds / 1000);

        var seconds = parseInt(totalSeconds % 60, 10);
        var minutes = parseInt(totalSeconds / 60, 10) % 60;
        var hours = parseInt(totalSeconds / 3600, 10);

        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        hours = hours < 10 ? '0' + hours : hours;

        return hours + ':' + minutes + ':' + seconds;
    }

    render(){
        let timeRemaining = this.state.timeRemaining;
        return (
            <Animated.Text style={_.assign({},this.props.style,{fontFamily:'Roboto'})}>{this.getFormattedTime(timeRemaining)}</Animated.Text>
        )
    }
}