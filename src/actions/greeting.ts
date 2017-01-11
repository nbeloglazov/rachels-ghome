import * as actions from '../actions';

export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage === actions.GREETING_REQUEST;
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    request.user.heardFullGreeting = true;
    return {
      user: request.user,
      responseType: actions.ResponseType.Tell,
      responseMessage: '<speak>Welcome to Rachel\'s english! <break time="1"/> ' +
      'This is a demo response. Goodbye.'
    };
  },

  getType() { return actions.ActionType.Greeting; }
};
