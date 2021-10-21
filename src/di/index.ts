export const AppModule = {
  /* Services */
  AI: Symbol.for('AI'),
  LOG: Symbol.for('LogService'),
  ROUTER: Symbol.for('RouterService'),
  PERMISSION: Symbol.for('PermissionService'),
  PROCESS_INFO: Symbol.for('ProcessInfoService'),
  MODAL: Symbol.for('ModalService'),
  SESSION: Symbol.for('SessionService'),

  /* Screens */
  SPLASH_SCREEN: Symbol.for('SplashScreen'),
  CHAT_GROUPS_SCREEN: Symbol.for('ChatGroupsScreen'),
  CHAT_SCREEN: Symbol.for('ChatScreen'),
};
