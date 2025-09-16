export const AppModule = {
  /* Services */
  LOG: Symbol.for('LogService'),
  ROUTER: Symbol.for('RouterService'),
  PERMISSION: Symbol.for('PermissionService'),
  PROCESS_INFO: Symbol.for('ProcessInfoService'),
  PUSH_NOTIFICATION: Symbol.for('PushNotificationService'),
  MODAL: Symbol.for('ModalService'),
  SESSION: Symbol.for('SessionService'),
  USER: Symbol.for('UserService'),

  /* Screens */
  SPLASH_SCREEN: Symbol.for('SplashScreen'),
  WELCOME_SCREEN: Symbol.for('WelcomeScreen'),
  LOGIN_SCREEN: Symbol.for('LoginScreen'),
  REGISTER_SCREEN: Symbol.for('RegisterScreen'),
  HOME_SCREEN: Symbol.for('HomeScreen'),
};
