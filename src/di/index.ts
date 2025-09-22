export const AppModule = {
  /* Services */
  AI: Symbol.for('AI'),
  HTTP: Symbol.for('HttpClient'),
  LOG: Symbol.for('LogService'),
  ROUTER: Symbol.for('RouterService'),
  PERMISSION: Symbol.for('PermissionService'),
  PROCESS_INFO: Symbol.for('ProcessInfoService'),
  PUSH_NOTIFICATION: Symbol.for('PushNotificationService'),
  MODAL: Symbol.for('ModalService'),
  SESSION: Symbol.for('SessionService'),
  USER: Symbol.for('UserService'),

  POSTS_VM: Symbol.for('PostsVM'),
  POSTS_DATASOURCE: Symbol.for('PostsAPI'),

  /* Screens */
  SPLASH_SCREEN: Symbol.for('SplashScreen'),
  WELCOME_SCREEN: Symbol.for('WelcomeScreen'),
  LOGIN_SCREEN: Symbol.for('LoginScreen'),
  REGISTER_SCREEN: Symbol.for('RegisterScreen'),
  HOME_SCREEN: Symbol.for('HomeScreen'),
  CHAT_GROUPS_SCREEN: Symbol.for('ChatGroupsScreen'),
  CHAT_SCREEN: Symbol.for('ChatScreen'),
};
