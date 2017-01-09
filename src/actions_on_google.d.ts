// TODO: add all API functions from actions-on-google

/**
 * Types for 'actions-on-google' node js library.
 * See reference here: https://developers.google.com/actions/reference/ActionsSdkAssistant
 */
declare module "actions-on-google" {

  /**
   * Options object passed to ActionsSdkAssistant constructor.
   */
  interface ActionsSdkAssistantOptions {
    // TODO: use correct typings from express.
    request: Object;
    response: Object;
    sessionStarted?: () => any;
  }

  /**
   * List of standard intents that the Assistant provides. Must be accessed from instance of assistant:
   *
   *   const assistant = new ActionsSdkAssistant(...);
   *   assistant.StandardIntents.MAIN
   */
  interface StandardIntents {
    readonly MAIN: string;
    readonly TEXT: string;
    readonly PERMISSION: string;
  }

  /**
   * Function that processes action request.
   */
  interface ActionHandler {
    (assistant: ActionsSdkAssistant): void;
  }

  class ActionsSdkAssistant {
    constructor(options: ActionsSdkAssistantOptions);

    readonly StandardIntents: StandardIntents;

    handleRequest(handler: Map<string, ActionHandler>|ActionHandler): void;

    // TODO: change return type to HTTP response.
    tell(textToSpeech: string): Object|null;
  }
}