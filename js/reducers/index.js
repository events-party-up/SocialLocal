
import { combineReducers } from 'redux';

import drawer from './drawer';
import login from './login'
import error from './error'
import tabsNavigation from './tabsNavigation';
import messages from './messages'

export default combineReducers({
  drawer,
  login,
  error,
  tabsNavigation: tabsNavigation.tabs,
  inviteNavigation: tabsNavigation.party,
  messages
});
