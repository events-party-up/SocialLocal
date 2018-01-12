import React, {Component} from 'react';

import InviteButton from './InviteButton';
import {View} from 'react-native';

export default class EventsControl extends Component{

    static propTypes={
        onMessage: React.PropTypes.func,
        onAddTime: React.PropTypes.func,
        onInvitationStatusChange: React.PropTypes.func,
        ownedEvent: React.PropTypes.bool.isRequired
    }

    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.cardButton}>
             <InviteButton isDisabled={true} active={true} activeText="MESSAGE" onPress={()=>this.props.onMessage()}/>
                {this.props.ownedEvent?
                <InviteButton ctype='addTime' isDisabled={true} active={true} activeText="ADD TIME" onPress={()=>this.props.onAddTime()}/> :
                <InviteButton ctype='going' active={this.props.going} activeText="GOING" inactiveText="NOT GOING" onPress={(val)=>this.props.onInvitationStatusChange(val)}/>                         
            }
            </View>
        );
    }
}

const styles={
    cardButton:{
            flex:1,
        backgroundColor:'#FFF',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop: 10
    }
}