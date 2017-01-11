/// <reference path="actions_on_google.d.ts" />

import {User} from './user';
import * as actionsSdk from 'actions-on-google';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {ActionHandler, ActionRequest, ActionResponse, ResponseType, GREETING_REQUEST} from './actions';
import {HANDLER as GREETING_HANDLER} from './actions/greeting';

export const ACTION_HANDLERS: Array<ActionHandler> = [
    GREETING_HANDLER
];

function getHandlerForRequest(request: ActionRequest): ActionHandler {
  for (let handler of ACTION_HANDLERS) {
    if (handler.canHandle(request)) {
      return handler;
    }
  }
  throw new Error('Could not find handler for request: ' + JSON.stringify(request));
}

function handleRequest(request: ActionRequest, assistant: actionsSdk.ActionsSdkAssistant): void {
  const handler: ActionHandler = getHandlerForRequest(request);
  console.log('Request handler: ' + handler.getType());
  const response: ActionResponse = handler.handle(request);
  // TODO: save user profile in DB
  console.log(response);
  if (response.responseType === ResponseType.Tell) {
    assistant.tell(response.responseMessage);
  } else if (response.responseType === ResponseType.Ask) {
    throw new Error('TODO: implement Ask');
  } else {
    throw new Error('Unknown ResponseType: ' + response.responseType);
  }
}

function createUser(): User {
  return {
    id: '123',
    lastActionTimestampMs: -1,
    heardFullGreeting: false
  };
}

export function createApp(): express.Application {
  const app: express.Application = express();
  app.use(bodyParser.json({type: 'application/json'}));

  app.post('/', (request, response) => {
    console.log('handle post');
    const assistant = new actionsSdk.ActionsSdkAssistant({request: request, response: response});

    function mainIntent(assistant: actionsSdk.ActionsSdkAssistant) {
      console.log('mainIntent');
      const request: ActionRequest = {
        user: createUser(),
        requestMessage: GREETING_REQUEST
      };
      handleRequest(request, assistant);
    }

    const actionMap = new Map<string, actionsSdk.ActionHandler>();
    actionMap.set(assistant.StandardIntents.MAIN, mainIntent);

    assistant.handleRequest(actionMap);
  });
  return app;
}
