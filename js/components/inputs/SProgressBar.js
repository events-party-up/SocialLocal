import React, {Component} from 'react';

import {View} from 'react-native';

import baseStyle from '../../themes/base-styles';

export default class SProgressBar extends Component{
    
    render(){
        const lineWidth = this.props.progress;
        const {sprogressbar} = baseStyle;

        const styles = {
            ...sprogressbar,
            borderRadius: sprogressbar.barHeight,
            width: sprogressbar.width*lineWidth,
        }
        return(
            <View style={{height: sprogressbar.height}}>
                <View style={styles}/>
            </View>
        );
    }
}