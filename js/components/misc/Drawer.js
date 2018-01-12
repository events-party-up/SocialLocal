import React, { PropTypes } from 'react';
import {Drawer} from 'native-base';
import { DefaultRenderer, Actions } from 'react-native-router-flux';

import TabView from '../sideBar';

const propTypes = {
  navigationState: PropTypes.object,
};

class NavigationDrawer extends React.Component {


  render() {
    
    const state = this.props.navigationState;
    const children = state.children;
    return (
      <Drawer
        ref={(ref)=> {this.ref =ref;}}
        type="displace"
        open={state.open}
        onOpen={() => Actions.refresh({ key: state.key, open: true })}
        onClose={() => Actions.refresh({ key: state.key, open: false })}
        content={<TabView />}
        tapToClose
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        negotiatePan
        acceptPan={false}
        tweenHandler={(ratio) => ({
          main: { opacity: Math.max(0.54, 1 - ratio) },
        })}
      >
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    );
  }
}

NavigationDrawer.propTypes = propTypes;

export default NavigationDrawer;