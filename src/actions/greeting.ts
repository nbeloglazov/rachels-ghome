import * as actions from '../actions';

/**
 * This is entry handler which is called when user "enters" Rachel's English app.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage === actions.GREETING_REQUEST;
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    const secondsSinceLastVisist = Math.floor((Date.now() - request.user.lastActionTimestampMs) / 1000);
    const message = request.user.heardFullGreeting ?
        '<speak>Welcome back to Rachel\'s English! ' +
        'It has been <say-as interpret-as="cardinal">' + secondsSinceLastVisist +
        '</say-as> seconds since your last visit.</speak>' :
        '<speak>Welcome to Rachel\'s English! This is a demo response.</speak>';
    request.user.heardFullGreeting = true;
    return {
      user: request.user,
      responseType: actions.ResponseType.Ask,
      responseMessage: message
    };
  },

  getType() { return actions.ActionType.Greeting; }
};
