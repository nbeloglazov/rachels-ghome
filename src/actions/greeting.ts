import * as actions from '../actions';
import {AppState} from '../user';
import {getDisabledDebugOptions} from '../debug_options';

/**
 * This is entry handler which is called when user "enters" Rachel's English app.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage === actions.GREETING_REQUEST;
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    const message = request.user.heardFullGreeting ?
        '<speak>Welcome back to Rachel\'s English! What do you want to do today?</speak>' :
        '<speak>Welcome to Rachel\'s English!</speak>';
    const user = request.user;
    user.heardFullGreeting = true;
    user.appState = AppState.MainMenu;
    user.debugOptions = getDisabledDebugOptions();
    return {
      user: request.user,
      responseType: actions.ResponseType.Ask,
      responseMessage: message,
    };
  },

  getType() { return actions.ActionType.Greeting; }
};
