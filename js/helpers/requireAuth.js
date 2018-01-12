import React from 'react';
import { connect } from 'react-redux';

export default function(WrappedComponent){
  class Auth extends React.Component{
    ComponentWillMount(){
      if(!this.props.authenticated){
        let hasLocalStorageUser = false;

        for(let key in localStorage){
          if(key.startsWith("firebase:authUser:")){
            hasLocalStorageUser = true;
          }
        }

        if(!hasLocalStorageUser){
          // push it to sign In

        }
      }
    }

    render(){
      return <WrappedComponent {...this.props} />
    }

  }

  function mapStateToProps(state){
    return {authenticated: state.auth.authenticated};
  }

  return connect(mapStateToProps)(Auth);
}
