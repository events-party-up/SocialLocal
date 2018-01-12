import React, { Component } from 'react';

import {Image, View, StyleSheet, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import Modal from 'react-native-modalbox';
import { Container, Header, Title, InputGroup, Input, Content, Text, Button, Icon } from 'native-base';

class ModalComponent extends Component{
    constructor(props){
        super(props);
        this.state ={
            modalVisible: true
        }
    }

    setModalVisible(visible){
        this.setState({
            modalVisible: visible
        })
    }
    
    render(){
        return(
            <Container style={styles.container}>
            <Header>
              <Title> Forgot Password </Title>
            </Header>
            <Content scrollEnabled={this.state.scroll} keyboardShouldPersistTaps="always">
      
                <Modal 
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {alert('Modal has been closed.')}}
                    >
                    <View style={{marginTop: 22}}>
                        <View>
                            <Text> Hello world </Text>
                            <TouchableHighlight onPress={() => {
                                this.setModalVisible(!this.state.modalVisible)
                            }}>
                            <Text> Hide Modal </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </Content>
        </Container>
        )
    }
}

const styles = {
    container: {
        flex: 1
    }
};

const mapDispatchToProps = (dispatch) => ({
    pushRoute: (route) => dispatch(pushRoute(route)),
    popRoute:  (key) => dispatch(popRoute(key))
})

const mapStateToProps = (state) => ({
    navigation: state.navigation
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponent);