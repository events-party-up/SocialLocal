import React, {Component} from 'react';

/* Open source modules */
import {View, Image, TouchableOpacity,TouchableHighlight ,InteractionManager ,ListView} from 'react-native'
import { Container, Text, Content, Button, Header, Icon ,Thumbnail, Title} from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import {Actions, DefaultRenderer} from 'react-native-router-flux';

/* Themes modules */
import theme from '../../themes/base-theme';
import styles from './styles';
import baseStyle from '../../themes/base-styles';
import SProgressBar from '../inputs/SProgressBar';
import FormInput from '../inputs';
import {syncToStore, showError, pushRoute, popRoute} from '../../actions/login';
import * as db from '../../helpers/db';
import Spinner from '../inputs/Spinner';
import {locations} from '../../helpers/constants';

const glow2 = require('../../../images/glow2.png');
const blankphoto = require('../../../images/photo.png');
const logo  = require('../../../images/social-logo.png');


/* Component class */

class Profile extends Component{

    constructor(props){
        super(props);        		
    }

    
    

    componentWillMount(){

    }

    renderContent1(){
    	
    	return(
          	<View style ={styles.bg} >

	            <FormInput style={styles.input}
	              icon="ios-at-outline"
	              ctype='input'
	              autoCorrect={true}
	              autoFocus={true}
	              secureTextEntry={true}
	              title='OLD PASSWORD'
                  multiline={false}
	            />

		        <FormInput style={styles.input}
	              ctype='input'
	              autoCorrect={true}
	              autoFocus={true}
	              title='NEW PASSWORD'
	            />

	            <FormInput style={styles.input}
	              ctype='input'
	              autoCorrect={true}
	              autoFocus={true}
	              title='CONFIRM NEW PASSWORD'
	            />

	            <Button primary rounded style={Object.assign({},styles.button,{marginTop: 58})} >
                	<Text style={styles.buttonText}> Change Password </Text>
            	</Button>
          	</View>
        );
    }
 	

    render(){
        
        return(
        <Container theme={theme}>
              <View style={styles.line}/>
                <Image source={glow2} style={styles.container}>
                    <View style={{flex:1,justifyContent:'flex-end'}}>
                        {this.renderContent1()}
                    </View>
                </Image>
        </Container>
        );
    }
}

const mapStateToDispatch = (state) =>({
  user: ''
})



function bindActions(dispatch) {
    return {
         syncToStore: (userData) => dispatch(syncToStore(userData)),
         showError: (msg) => dispatch(showError(msg)),
    }
}

export default connect(mapStateToDispatch, bindActions)(Profile)