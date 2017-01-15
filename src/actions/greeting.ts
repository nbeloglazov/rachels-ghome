import * as actions from '../actions';

export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage === actions.GREETING_REQUEST;
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    const message = request.user.heardFullGreeting ?
        '<speak>Welcome back to Rachel\'s english! I\'ll be brief. Goodbye.' :
        '<speak>Welcome to Rachel\'s english! <break time="1"/> ' +
        'This is a demo response. Goodbye.';
    request.user.heardFullGreeting = true;
    return {
      user: request.user,
      responseType: actions.ResponseType.Tell,
      responseMessage: message
    };
  },

  getType() { return actions.ActionType.Greeting; }
};
