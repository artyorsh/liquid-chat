import { ComponentProps, createElement, forwardRef, ForwardRefExoticComponent, RefObject } from 'react';
import { createStaticNavigation, NavigationContainer, NavigationContainerRef, StaticNavigation } from '@react-navigation/native';
import { useReactNavigationDevTools } from '@rozenite/react-navigation-plugin';

type StaticNavigationContainerProps = Omit<ComponentProps<typeof NavigationContainer>, 'children'>;

type AnyNavigationContainerRef = NavigationContainerRef<any>;

type AnyNavigationContainerRefObject = RefObject<AnyNavigationContainerRef>;

export const createStaticNavigationWithRozenite = (tree: StaticNavigation<any, any, any>): ForwardRefExoticComponent<StaticNavigationContainerProps> => {
  const NavigationContainer = createStaticNavigation(tree);

  const NavigationContainerWithRozenite = forwardRef<AnyNavigationContainerRef, {}>((props, ref) => {
    useReactNavigationDevTools({ ref: ref as AnyNavigationContainerRefObject });

    return createElement(NavigationContainer, { ...props, ref });
  });

  NavigationContainerWithRozenite.displayName = 'NavigationContainerWithRozenite';

  return NavigationContainerWithRozenite;
};
