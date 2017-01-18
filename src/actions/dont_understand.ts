import * as actions from '../actions';

/**
 * This handler is called when no other handler can handle user requests. We assume at this point that we either
 * didn't understand or cannot handle user command.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(_: actions.ActionRequest): boolean {
    return true;
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    return {
      user: request.user,
      responseType: actions.ResponseType.Ask,
      responseMessage: '<speak>Sorry, I didn\'t understand that. Say "help" to hear possible commands.</speak>'
    };
  },

  getType() { return actions.ActionType.DontUnderstand; }
};
