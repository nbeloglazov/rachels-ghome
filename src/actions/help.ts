import * as actions from '../actions';

/**
 * This handler is called when user asks for help. The handler should tell user a list of possible commands.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage.toLowerCase().includes('help');
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    return {
      user: request.user,
      responseType: actions.ResponseType.Ask,
      responseMessage: '<speak>This is <say-as type="ordinal">30</say-as> day phrasal verbs challenge. You can say ' +
      'things like "play next lesson" or "play random lesson".</speak>'
    };
  },

  getType() { return actions.ActionType.Help; }
};
