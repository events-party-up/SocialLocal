
import { actions } from 'react-native-navigation-redux-helpers';
import { closeDrawer } from './drawer';

const {
  replaceAt,
  popRoute,
  pushRoute,
  reset,
} = actions;

export function resetTo(route){
  return (dispatch, getState) => {
    const navigation = getState().cardNavigation;

    dispatch(closeDrawer());

    dispatch(reset([{key: route}], navigation.key, 0));
  }
}

export default function navigateTo(route, homeRoute) {
  return (dispatch, getState) => {
    const navigation = getState().cardNavigation;
    const currentRouteKey = navigation.routes[navigation.routes.length - 1].key;

    dispatch(closeDrawer());

    if (currentRouteKey !== homeRoute && route !== homeRoute) {
      dispatch(replaceAt(currentRouteKey, { key: route}, navigation.key));
    } else if (currentRouteKey !== homeRoute && route === homeRoute) {
      dispatch(popRoute(navigation.key));
    } else if (currentRouteKey === homeRoute && route !== homeRoute) {
      dispatch(pushRoute({ key: route}, navigation.key));
    }
  };
}
