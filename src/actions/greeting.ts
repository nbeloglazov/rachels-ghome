import * as actions from '../actions';

export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage === actions.GREETING_REQUEST;
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    const secondsSinceLastVisist = Math.floor((Date.now() - request.user.lastActionTimestampMs) / 1000);
    const message = request.user.heardFullGreeting ?
        '<speak>Welcome back to Rachel\'s English! <break time="1"/> ' +
        'It has been <say-as interpret-as="cardinal">' + secondsSinceLastVisist +
        '</say-as> seconds since you last visit. Goodbye.</speak>' :
        '<speak>Welcome to Rachel\'s English! <break time="1"/> ' +
        'This is a demo response. Goodbye.</speak>';
    request.user.heardFullGreeting = true;
    return {
      user: request.user,
      responseType: actions.ResponseType.Tell,
      responseMessage: message
    };
  },

  getType() { return actions.ActionType.Greeting; }
};
