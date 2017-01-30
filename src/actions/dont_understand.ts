import * as actions from '../actions';
import {AppState} from '../user';

/**
 * This handler is called when no other handler can handle user requests. We assume at this point that we either
 * didn't understand or cannot handle user command.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(_: actions.ActionRequest): boolean {
    return true;
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    let message = 'Sorry, I didn\'t understand. ';
    if (request.user.appState === AppState.AwatingLessonCompleteConfirmation) {
      message += 'Say "yes" or "done" or "completed" to mark the lesson as completed. Or say "help to hear a list '
          + 'of possible commands.';
    } else {
      message += 'Say "help" to hear possible commands.';
    }
    return {
      user: request.user,
      responseType: actions.ResponseType.Ask,
      responseMessage: '<speak>' + message + '</speak>'
    };
  },

  getType() { return actions.ActionType.DontUnderstand; }
};
