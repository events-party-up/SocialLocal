import React, {Component} from 'React';
import * as db from '../../helpers/db';
import {InteractionManager} from 'react-native';
import { connect } from 'react-redux';
import {syncToStore} from '../../actions/login';

// here setstate is only for markers so we can update the view
// by calling functions in componentWillupdate
export var SubscribeUser = ComposedComponent => {
  class comp extends Component {
    constructor(props){
        super(props);
          this.userData = (!this.props.isFriendsView) ? this.props.user : this.props.friend;
          this.state ={
              isReady: false
          }        
          this.mount=true;
    }

    static propTypes={
      user: React.PropTypes.object,
    }

    componentDidMount(){
      
      InteractionManager.runAfterInteractions(() => {
            this.mount && this.setState({isReady: false }, this.addListener())
      })
    }
    
    addListener(){
        //const{user} = this.props;
        let user = this.userData
        this.listenerIds =  db.listenToUser(user.uid, (snap)=> {
            this.mount && this.setState({isReady: true, followers: snap.val()})
            //this.props.syncToStore({user})
        })

        this.listenerBlockedIds =  db.listenToUserBlocked(user.uid, (snap)=> {
            this.mount && this.setState({isReady: true, blocks: snap.val()})
            //this.props.syncToStore({user})
        })
    }

    componentWillUnmount(){
        this.mount = false;
      //  const {user} = this.props;
        let user = this.userData
        db.removeUserListener(user.uid, this.listenerIds);
        db.removeUserBlockedListener(user.uid, this.listenerBlockedIds);

    }

    render(){
        return <ComposedComponent {...this.props} {...this.state} />
    }
  }
  return connect(mapStateToDispatch, bindActions)(comp)
}

function bindActions(dispatch) {
    return {
         syncToStore: (userData) => dispatch(syncToStore(userData)),
         showError: (msg) => dispatch(showError(msg))
    }
}

const mapStateToDispatch = (state) =>({
    user: state.login.user,
});
