import React, {Component } from 'react';
import {View, StyleSheet, Modal, Text, ActivityIndicator, TouchableHighlight } from 'react-native';
import {connect} from 'react-redux';

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  textContent: {
    top: 80,
    height: 50,
    fontSize: 20,
    fontWeight: 'bold'
  }
};

const SIZES = ['small', 'normal', 'large']

class Loading extends Component{
    constructor(props){
        super(props);
        this.state ={
            visible: this.props.visible,
            textContent: this.props.textContent
        }

    }

    static propTypes = {
        visible: React.PropTypes.bool,
        textContent: React.PropTypes.string,
        color: React.PropTypes.string,
        size: React.PropTypes.oneOf(SIZES),
        overlayColor: React.PropTypes.string
    }

    static defaultProps = {
        visible: false,
        textContent: "",
        color: 'white',
        size: 'large',
        overlayColor: 'rgba(0, 0, 0, 25)'
    };

    componentWillReceiveProps(nextProps){
        const {visible, textContent} = nextProps;
        this.setState({visible, textContent})
    }

    _renderDefaultContent(){

        return(
            <View style={styles.background}>
                <ActivityIndicator
                    color={this.props.color}
                    size ={this.props.size}
                    style={{flex: 1}}
                />
                <View style={styles.textContainer}>
                    <Text style={Object.assign({},styles.textContent, this.props.textStyle)}>{this.state.textContent} </Text>
                </View>
            </View>    
        );
    }

    _renderSpinner(){
        const { visible} = this.state;
        
        if(!visible)
            return (<View />);

        const spinner = (
            <View style={Object.assign({},styles.container, {backgroundColor: this.props.overlayColor})}
                    key={'spinner_${Date.now()}'}>
                    
                    {this.props.children ? this.props.children: this._renderDefaultContent()}
            </View>
        )
        
        return (
            <Modal onRequestClose={() => this.setModalVisible(false)} visible={visible} transparent>
                {spinner}
            </Modal>
        )
    }

    setModalVisible(visible){
        this.setState({
            visible
        })
    }
    
    render(){
        return this._renderSpinner();
    }
}

const mapDispatchToProps = (dispatch) => ({
    pushRoute: (route) => dispatch(pushRoute(route)),
    popRoute:  (key) => dispatch(popRoute(key))
})

const mapStateToProps = (state) => ({
    navigation: state.navigation
});

export default connect(mapStateToProps, mapDispatchToProps)(Loading);