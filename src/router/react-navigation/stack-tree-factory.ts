import { INavigationTreeFactory } from './react-navigation-router';
import { StaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { IRoute } from '..';

type IRouteMap = () => Record<IRoute, React.ComponentType>;

export const StackTreeFactory = (routeMap: IRouteMap): INavigationTreeFactory => {
  return () => createNativeStackNavigator({
    id: undefined,
    screenOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
    screens: routeMap(),
  }) as StaticNavigation<any, any, any>;
};
