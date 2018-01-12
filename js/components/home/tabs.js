'use strict';

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    Platform,
} from 'react-native';

type State = {
    keyboardUp: boolean,
}

class Tabs extends Component {
    state: State = {};

    onSelect(el){
        if (el.props.onSelect) {
            el.props.onSelect(el);
        } else if (this.props.onSelect) {
            this.props.onSelect(el.props.name);
        }
    }

    componentWillMount(){
        if (Platform.OS==='android') {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
        }
    }

    componentWillUnmount(){
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardWillShow = (e) => {
        this.setState({ keyboardUp: true });
    };

    keyboardWillHide = (e) => {
        this.setState({ keyboardUp: false });
    };

    render(){
        const self = this;
        let selected = this.props.selected
        if (!selected){
            React.Children.forEach(this.props.children.filter(c=>c), el=>{
                if (!selected || el.props.initial){
                    selected = el.props.name || el.key;
                }
            });
        }
        return (
            <View style={_.assign({},styles.tabbarView, this.props.style, this.state.keyboardUp && styles.hidden)}>
                {React.Children.map(this.props.children.filter(c=>c),(el)=>
                    <TouchableOpacity key={el.props.name+"touch"}
                       testID={el.props.testID}
                       style={_.assign({},styles.iconView, this.props.iconStyle, (el.props.name || el.key) == selected ? styles.selectedIconStyle || el.props.selectedIconStyle || {} : {} )}
                       onPress={()=>!self.props.locked && self.onSelect(el)}
                       onLongPress={()=>self.onSelect(el)}
                       activeOpacity={el.props.pressOpacity}>
                         {selected == (el.props.name || el.key) ? React.cloneElement(el, {selected: true, style: [el.props.style, {color:'white'}]}) : el}
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}
var styles = {
    tabbarView: {
        flex: 1,
        height:30,
        opacity:1,
        backgroundColor:'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth:0.5,
        borderColor:'#007AFF'
    },
    selectedIconStyle:{
        backgroundColor:'#007AFF'
    },
    iconView: {
        flex: 1,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:'#007AFF'
    },
    hidden: {
        height: 0,
    },
};

module.exports = Tabs;