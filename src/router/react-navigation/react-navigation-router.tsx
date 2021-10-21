import React from 'react';
import { NavigationContainer, NavigationContainerRef, Route, StackActions } from '@react-navigation/native';

import { ILogger } from '@/log';

import { INavigationLifecycleListener, IRoute, IRouteParams, IRouter } from '..';

export type IRouteFactory = () => React.ReactElement;

export class ReactNavigationRouter implements IRouter {

  private navigationContainerRef = React.createRef<NavigationContainerRef<{}>>();

  private currentRoute: IRoute = '/';

  private navigationListeners: Map<IRoute, INavigationLifecycleListener> = new Map();

  constructor(private logger: ILogger, private routeFactory: IRouteFactory) {
  }

  public getWindow(): React.ReactElement {
    return (
      <NavigationContainer
        ref={this.navigationContainerRef}
        onReady={this.onNavigationReady}
        onStateChange={this.onNavigationStateChange}>
        {this.routeFactory()}
      </NavigationContainer>
    );
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
    this.navigationListeners.get(this.currentRoute)?.onFocus?.();
  };

  private onNavigationStateChange = (): void => {
    const nextRoute = this.navigationContainerRef.current?.getCurrentRoute() as Route<IRoute> | undefined;

    if (nextRoute && nextRoute.name !== this.currentRoute) {
      this.logger.info(`Moving from ${this.currentRoute} to ${nextRoute.name}`);

      this.navigationListeners.get(this.currentRoute)?.onBlur?.();
      this.navigationListeners.get(nextRoute.name)?.onFocus?.();

      this.currentRoute = nextRoute.name as IRoute;
    }
  };

  /*
   * TODO: I am not sure if this is the right way to do this.
   * I didn't want to use {navigation} prop from react-navigation, so came up with this.
   * It might be so, that onFocus is called earlier than componendDidMount, which is not correct.
   * The onNavigationStateChange should be tested to see it.
   *
   * @see {onNavigationStateChange}
   */
  public subscribe = (route: IRoute, listener: INavigationLifecycleListener): Function => {
    this.navigationListeners.set(route, listener);

    return () => {
      this.navigationListeners.delete(route);
    };
  };
}
