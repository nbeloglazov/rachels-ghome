/// <reference path="libraries.d.ts" />

import {User, PreActionHook} from './user';
import * as actionsSdk from 'actions-on-google';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {ActionHandler, ActionRequest, ResponseType, GREETING_REQUEST} from './actions';
import {HANDLER as GREETING_HANDLER} from './actions/greeting';
import {HANDLER as DONT_UNDERSTAND_HANDLER} from './actions/dont_understand';
import {HANDLER as HELP_HANDLER} from './actions/help';
import {HANDLER as PLAY_NEXT_LESSON_HANDLER} from './actions/play_next_lesson';
import {HANDLER as QUIT_HANDLER} from './actions/quit';
import {HANDLER as PLAY_RANDOM_LESSON_HANDLER} from './actions/play_random_lesson';
import {Database} from "./db";
import * as hooks from './hooks';

export const ACTION_HANDLERS: Array<ActionHandler> = [
  GREETING_HANDLER,
  HELP_HANDLER,
  PLAY_NEXT_LESSON_HANDLER,
  PLAY_RANDOM_LESSON_HANDLER,
  QUIT_HANDLER,
  DONT_UNDERSTAND_HANDLER
];

function getHandlerForRequest(request: ActionRequest): ActionHandler {
  for (let handler of ACTION_HANDLERS) {
    if (handler.canHandle(request)) {
      return handler;
    }
  }
  throw new Error('Could not find handler for request: ' + JSON.stringify(request));
}

function executePreActionHooks(user: User): User {
  const userHooks = user.preActionsHooks || [];
  return userHooks.reduce(
      (user: User, hook: PreActionHook) => hooks.executePreActionHook(hook, user), user);
}

function handleRequest(request: ActionRequest, assistant: actionsSdk.ActionsSdkAssistant, database: Database): void {
  const handler = getHandlerForRequest(request);
  console.log('Request handler: ' + handler.getType());
  request.user = executePreActionHooks(request.user);
  const response = handler.handle(request);
  console.log(response);
  response.user.lastActionTimestampMs = Date.now();
  database.saveUser(response.user).then(() => {
    if (response.responseType === ResponseType.Tell) {
      assistant.tell(response.responseMessage);
    } else if (response.responseType === ResponseType.Ask) {
      assistant.ask(assistant.buildInputPrompt(true, response.responseMessage,
          ['Please tell me what to do or say "help" to hear the list of possible commands.']));
    } else {
      throw new Error('Unknown ResponseType: ' + response.responseType);
    }
  });
}

function loadUser(assistant: actionsSdk.ActionsSdkAssistant, database: Database): Promise<User> {
  const userId = assistant.getUser().user_id;
  return database.loadOrGetDefaultUser(userId);
}

export function createApp(database: Database): express.Application {
  const app: express.Application = express();
  app.use(bodyParser.json({type: 'application/json'}));

  let voiceRequestProcessed = 0;
  app.post('/', (request, response) => {
    voiceRequestProcessed++;
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

    function textIntent(assistant: actionsSdk.ActionsSdkAssistant) {
      console.log('textIntent');
      loadUser(assistant, database).then((user) => {
        handleRequest({
          user: user,
          requestMessage: assistant.getRawInput()
        }, assistant, database);
      });
    }

    const actionMap = new Map<string, actionsSdk.ActionHandler>();
    actionMap.set(assistant.StandardIntents.MAIN, mainIntent);
    actionMap.set(assistant.StandardIntents.TEXT, textIntent);

    assistant.handleRequest(actionMap);
  });
  app.get('/', (_, response) => {
    response.status(200).send(`Up and running! Processed ${voiceRequestProcessed} voice requests so far.`);
  });
  return app;
}
