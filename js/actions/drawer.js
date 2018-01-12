
import type { Action } from './types';

export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';

import {Actions, ActionConst } from 'react-native-router-flux';
export function openDrawer():Action {
  //Actions.drawer({open: true})
  Actions.refresh({key:'drawer', open: true})
  return {
    type: OPEN_DRAWER,
  };
}

export function closeDrawer():Action {
  return {
    type: CLOSE_DRAWER,
  };
}
