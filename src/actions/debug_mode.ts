import * as actions from '../actions';
import {getDisabledDebugOptions, getEnabledDebugOptions} from '../debug_options';

/**
 * This handler is called when user asks for help. The handler should tell user a list of possible commands.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage.toLowerCase().includes('debug');
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    let response: string;
    if (request.user.debugOptions.useShortDebugLesson) {
      request.user.debugOptions = getDisabledDebugOptions();
      response = '<speak>debug mode disabled</speak>';
    } else {
      request.user.debugOptions = getEnabledDebugOptions();
      response = '<speak>debug mode enabled</speak>';
    }
    return {
      user: request.user,
      responseType: actions.ResponseType.Ask,
      responseMessage: response
    };
  },

  getType() { return actions.ActionType.Debug; }
};
