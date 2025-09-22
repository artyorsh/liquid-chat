export const AppModule = {
  /* Services */
  AI: Symbol.for('AI'),
  HTTP: Symbol.for('HttpClient'),
  LOG: Symbol.for('LogService'),
  ROUTER: Symbol.for('RouterService'),
  PROCESS_INFO: Symbol.for('ProcessInfoService'),
  MODAL: Symbol.for('ModalService'),

  /* Screens */
  SPLASH_SCREEN: Symbol.for('SplashScreen'),
  CHAT_GROUPS_SCREEN: Symbol.for('ChatGroupsScreen'),
  CHAT_SCREEN: Symbol.for('ChatScreen'),
};
