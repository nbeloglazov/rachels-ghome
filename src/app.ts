/// <reference path="libraries.d.ts" />

import {User} from './user';
import * as actionsSdk from 'actions-on-google';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {ActionHandler, ActionRequest, ResponseType, GREETING_REQUEST} from './actions';
import {HANDLER as GREETING_HANDLER} from './actions/greeting';
import {Database} from "./db";

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

function handleRequest(request: ActionRequest, assistant: actionsSdk.ActionsSdkAssistant, database: Database): void {
  const handler = getHandlerForRequest(request);
  console.log('Request handler: ' + handler.getType());
  const response = handler.handle(request);
  console.log(response);
  database.saveUser(response.user);
  if (response.responseType === ResponseType.Tell) {
    assistant.tell(response.responseMessage);
  } else if (response.responseType === ResponseType.Ask) {
    throw new Error('TODO: implement Ask');
  } else {
    throw new Error('Unknown ResponseType: ' + response.responseType);
  }
}

function loadUser(assistant: actionsSdk.ActionsSdkAssistant, database: Database): Promise<User> {
  const userId = assistant.getUser().user_id;
  return database.loadOrGetDefaultUser(userId);
}

export function createApp(database: Database): express.Application {
  const app: express.Application = express();
  app.use(bodyParser.json({type: 'application/json'}));

  app.post('/', (request, response) => {
    console.log('handle post');
    const assistant = new actionsSdk.ActionsSdkAssistant({request: request, response: response});

    function mainIntent(assistant: actionsSdk.ActionsSdkAssistant) {
      console.log('mainIntent');
      loadUser(assistant, database).then((user) => {
        handleRequest({
          user: user,
          requestMessage: GREETING_REQUEST
        }, assistant, database);
      });
    }

    const actionMap = new Map<string, actionsSdk.ActionHandler>();
    actionMap.set(assistant.StandardIntents.MAIN, mainIntent);

    assistant.handleRequest(actionMap);
  });
  return app;
}
