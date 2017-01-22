import * as actions from '../actions';
import {AppState} from '../user';

/**
 * This handler is called when user want's to quit.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    const userRequest = request.requestMessage.toLowerCase();
    return userRequest.includes('quit') || userRequest.includes('exit');
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    request.user.appState = AppState.Quit;
    return {
      user: request.user,
      responseType: actions.ResponseType.Tell,
      responseMessage: '<speak>See you later!</speak>'
    };
  },

  getType() { return actions.ActionType.Quit; }
};
