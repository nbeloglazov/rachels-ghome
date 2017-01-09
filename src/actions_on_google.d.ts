// TODO: add all API functions from actions-on-google

declare module "actions-on-google" {
  interface ActionsSdkAssistantOptions {
    // TODO: use correct typings from express.
    request: Object;
    response: Object;
    sessionStarted?: () => any;
  }

  export class ActionsSdkAssistant {
    constructor(options: ActionsSdkAssistantOptions);
  }
}