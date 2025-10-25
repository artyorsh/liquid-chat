import { FC, ReactNode } from 'react';
import { INavigationTreeFactory } from './react-navigation-router';
import { StaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { IRoute } from '..';

type IRouteMap = () => Record<IRoute, React.ComponentType>;

export interface ILayoutProps {
  routeName: string;
  children: ReactNode;
}

export interface IStackRouteFactoryConfig {
  routeMap: IRouteMap;
  layout?: FC<ILayoutProps>;
}

export const StackTreeFactory = (config: IStackRouteFactoryConfig): INavigationTreeFactory => {
  return () => createNativeStackNavigator({
    id: undefined,
    screenOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
    screens: Object.entries(config.routeMap()).reduce((acc, [routeName, component]) => {
      return {
        ...acc,
        [routeName]: {
          screen: component,
          layout: ({ children }) => {
            if (config.layout) {
              return config.layout({ routeName, children });
            }

            return children;
          },
        },
      };
    }, {}),
  }) as StaticNavigation<any, any, any>;
};
