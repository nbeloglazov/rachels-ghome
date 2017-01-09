/// <reference path="actions_on_google.d.ts" />

import {User} from './user';
import {ActionsSdkAssistant, ActionHandler} from 'actions-on-google';
import * as express from 'express';
import * as bodyParser from 'body-parser';

const user: User = {id: '12345', lastActionTimestampMs: 0, heardFirstGreeting: false};
console.log(user);

export function add(a: number, b: number): number {
  return a + b;
}

export function createApp(): express.Application {
  const app: express.Application = express();
  app.use(bodyParser.json({type: 'application/json'}));

  app.post('/', (request, response) => {
    console.log('handle post');
    const assistant = new ActionsSdkAssistant({request: request, response: response});

    function mainIntent(assistant: ActionsSdkAssistant) {
      console.log('mainIntent');
      assistant.tell('<speak>Welcome to Rachel\'s english! <break time="1"/> ' +
          'This is a demo response. Goodbye.');
    }

    const actionMap = new Map<string, ActionHandler>();
    actionMap.set(assistant.StandardIntents.MAIN, mainIntent);

    assistant.handleRequest(actionMap);
  });
  return app;
}
