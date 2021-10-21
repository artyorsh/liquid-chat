import { IRouteFactory } from './react-navigation-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { IRoute } from '..';

type IRouteMap = Partial<Record<IRoute, React.ComponentType>>;

export const StackRouteFactory = (routeMap: IRouteMap): IRouteFactory => {
  return () => {
    const Stack = createNativeStackNavigator();

    return (
      <Stack.Navigator
        id={undefined}
        screenOptions={{ headerShown: false, gestureEnabled: false }}>
        {Object.entries(routeMap).map(([route, component]) => (
          <Stack.Screen
            key={route}
            name={route}
            component={component}
          />
        ))}
      </Stack.Navigator>
    );
  };
};
