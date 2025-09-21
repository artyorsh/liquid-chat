import { createElement, createRef } from 'react';
import { createStaticNavigation, NavigationContainerRef, NavigationState, StackActions, StaticNavigation } from '@react-navigation/native';

import { ILogger } from '@/log';

import { INavigationLifecycleListener, IRoute, IRouteParams, IRouter } from '..';

export type INavigationTreeFactory = () => StaticNavigation<any, any, any>;

export class ReactNavigationRouter implements IRouter {

  private navigationContainerRef = createRef<NavigationContainerRef<{}>>();

  private currentRoute: IRoute = '/';

  private navigationListeners: Map<IRoute, INavigationLifecycleListener[]> = new Map();

  constructor(private logger: ILogger, private treeFactory: INavigationTreeFactory) {
  }

  public getWindow(): React.ReactElement {
    const NavigationContainer = createStaticNavigation(this.treeFactory());

    return createElement(NavigationContainer, {
      ref: this.navigationContainerRef,
      onReady: this.onNavigationReady,
      onStateChange: this.onNavigationStateChange,
    });
  }

  public navigate = (route: IRoute, params?: IRouteParams): void => {
    // @ts-ignore: surpress IRoute not assignable to type never
    this.navigationContainerRef.current?.navigate(route, params);
  };

  public replace = (route: IRoute, params?: IRouteParams): void => {
    this.navigationContainerRef.current?.dispatch(StackActions.pop());
    this.navigate(route, params);
  };

  public goBack = (): void => {
    this.navigationContainerRef.current?.goBack();
  };

  private onNavigationReady = (): void => {
    const listeners: INavigationLifecycleListener[] = this.navigationListeners.get(this.currentRoute);
    listeners?.forEach(listener => listener.onFocus?.());
  };

  private onNavigationStateChange = (state: NavigationState | undefined): void => {
    if (!state) {
      return;
    }

    const nextRoute = state.routes[state.index].name as IRoute;

    if (this.currentRoute === nextRoute) {
      return;
    }

    this.logger.info(`Moving from ${this.currentRoute} to ${nextRoute}`);

    const currentRouteListeners: INavigationLifecycleListener[] = this.navigationListeners.get(this.currentRoute);
    currentRouteListeners?.forEach(listener => listener.onBlur?.());

    const nextRouteListeners: INavigationLifecycleListener[] = this.navigationListeners.get(nextRoute);
    nextRouteListeners?.forEach(listener => listener.onFocus?.());

    this.currentRoute = nextRoute;
  };

  public subscribe = (route: IRoute, listener: INavigationLifecycleListener): Function => {
    const routeListeners: INavigationLifecycleListener[] = this.navigationListeners.get(route) || [];
    this.navigationListeners.set(route, [...routeListeners, listener]);

    return () => {
      const nextListeners: INavigationLifecycleListener[] = this.navigationListeners.get(route)
        .filter(l => l !== listener);

      this.navigationListeners.set(route, nextListeners);
    };
  };

  public getCurrentRoute(): IRoute {
    return this.currentRoute;
  }
}
