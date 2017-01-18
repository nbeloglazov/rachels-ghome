import {User} from './user';

/**
 * Enum of support action handlers.
 */
export enum ActionType {
  Greeting, DontUnderstand, Help
}

/**
 * Possible responses accepted by Google Actions SDK.
 */
export enum ResponseType {
  /** https://developers.google.com/actions/reference/ActionsSdkAssistant#tell */
  Tell,
  /** https://developers.google.com/actions/reference/ActionsSdkAssistant#ask */
  Ask
}

/**
 * Data that ActionHandler receives.
 */
export interface ActionRequest {
  /** User profile loaded from database or created fresh if this is a new user. */
  user: User;
  /** User request, text that they said. */
  requestMessage: string;
}

/**
 * Response from ActionHandler.
 */
export interface ActionResponse {
  /**
   * User profile to be saved to database. ActionHandler should not work with database directly. Instead it should
   * change user profile object and pass in response.
   */
  user: User;
  responseType: ResponseType;
  /** Message to be sent to user. Should be in SSML format: https://developers.google.com/actions/reference/ssml */
  responseMessage: string;
}

/**
 * Handler that processes single user action. All logic in Rachel's English GHome is a set of actions. When user
 * we receive user request - we iterate through all actions until we find one that can handle the request and handles
 * it.
 */
export interface ActionHandler {
  canHandle(request: ActionRequest): boolean;
  handle(request: ActionRequest): ActionResponse;
  getType(): ActionType;
}

/**
 * Request mesage for Greeting action handler. First request from user doesn't have any message so we introduce this
 * fake message to so that Greeting handler can distinguish it.
 */
export const GREETING_REQUEST:string = 'GREETING_REQUEST';



