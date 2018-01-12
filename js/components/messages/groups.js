import React, {Component} from 'react';
import {
    View,
    InteractionManager
} from 'react-native';

/** OpenSource modules **/
import { Container, Content, List, ListItem,Icon, Right, Thumbnail, Text, Body } from 'native-base';
import { connect } from 'react-redux';
import {Actions, ActionConst, DefaultRenderer} from 'react-native-router-flux';

/** Internal modules **/
import {resetRoute, pushRoute, popRoute, showError} from '../../actions/login';
import * as dbMessage from '../../helpers/messages';
import {WithGroupSubscription} from '../misc/WithGroupSubscription'
import Spinner from '../inputs/Spinner';
import styles from '../profile/styles';

//const group = require("../../../images/group.png")
//const single = require("../../../images/single.png")

class Groups extends Component{
    constructor(props){
        super(props);

        this.mount = true;
        this.state ={groups: [], loading: true, isListEmpty: true}
    }

    componentWillReceiveProps(nextProps){
      
      let {markers,events} = nextProps;

      if(nextProps.isReady){
        let isListEmpty=false;
        if(_.isEmpty(events))
          isListEmpty=true;
        this.mount && this.setState({groups: markers, loading: false, isListEmpty});
      }
    }

    componentWillUnmount(){
      this.mount = false;
    }

    onPressGroup(group){
      p = new Promise((resolve, reject) => {
        setTimeout(resolve, 100, 'foo');
      });
      p.then(()=> this.props.pushRoute({key: 'chat', group}))
    }

    renderContent1(){
      const {groups} = this.state;
      if(!this.state.loading && this.state.isListEmpty){
        return ( 
          <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 14, fontFamily: 'worksans-regular'}}>No Messages</Text>
          </View>
        );
      }

      return <List dataArray={groups}
              renderRow={(item)=> 
              <ListItem onPress={() => this.onPressGroup(item) }>
                  <Body>
                      <Text style={styles.profileRowText} >{item.info.name}</Text>
                      <Text style={styles.profileRowSubText}>Created by {item.info.owner.name}</Text>
                      
                  </Body>
                  <Right>
                      <Icon name="arrow-forward" />
                  </Right>
              </ListItem>
                }
            />
    }

    render(){
        return (
                <Container>

                  <View style={{flex:1}}>
                    {this.renderContent1()}
                    </View>

                </Container>
              );
    }
}

const mapStateToDispatch = (state) =>({
    tabsNavigation: state.tabsNavigation,
    uid: state.login.uid,
    user: state.login.user
})

function bindActions(dispatch) {
    return {
         pushRoute: (route) => dispatch(pushRoute(route)),
         popRoute: () => dispatch(popRoute()),
         resetRoute:(key) => dispatch(resetRoute(key)),
    }
}

var page = connect(mapStateToDispatch, bindActions)(Groups)
export default WithGroupSubscription(page)