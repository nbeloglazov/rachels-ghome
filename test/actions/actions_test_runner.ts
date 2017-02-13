import {TestDatabases} from '../test_utils';
import {User, getDefaultUser} from '../../src/user';
import * as supertest from 'supertest';
import {createApp} from '../../src/app';
import {ActionsSdkAssistant} from 'actions-on-google';

let userIdGenerator = 0;
let conversationIdGenerator = 0;

interface ActionResult {
  user: User;
  ssml: string;
  expectUserResponse: boolean;
}

/**
 * Class for running e2e tests on action handlers. Each action handler should have e2e test that send raw user request
 * and validates response. This class allows for easy request-response testing and assumes single user. The workflow is
 * the following:
 *
 * 1. Create runner.
 * 2. If needed, modify user in the runner.
 * 3. Send user input using handleAction()
 * 4. Validate generated ssml response and also user object.
 *
 * Usage:
 *
 * describe('action handler foo', wrapDatabases(function(databases) {
 *   if('should return foo', function() {
 *     const runner = new ActionsTestRunner(databases);
 *     runner.modifyUser((user) => { ... });
 *     runner.handleAction('tell me foo').then((result) => {
 *       // check that response contains foo
 *       assert.include(result.ssml, 'foo');
 *       // check that handler changed user
 *       assert.equal(result.user.askedForFoo, true);
 *     });
 *   });
 * }));
 */
export class ActionsTestRunner {
  private user: User;
  private databases: TestDatabases;
  private request: supertest.SuperTest<supertest.Test>;
  private conversationId: string;

  constructor(databases: TestDatabases) {
    this.databases = databases;
    this.user = getDefaultUser(String(++userIdGenerator));
    this.request = supertest(createApp(databases.db!));
    this.conversationId = String(++conversationIdGenerator);
  }

  async modifyUser(modifyFn: (user: User) => User): Promise<User> {
    this.user = modifyFn(this.user);
    await this.databases.db!.saveUser(this.user);
    return this.user;
  }

  async openRachelsEnglish(): Promise<ActionResult> {
    const result = await this.handleActionInternal('rachel\'s english', ActionsSdkAssistant.prototype.StandardIntents.MAIN);
    // Hack to make user to use lessons for automated tests.
    result.user = await this.modifyUser((user) => {
      user.debugOptions.useCourseForAutomatedTests = true;
      return user;
    });
    return result;
  }

  handleAction(userInput: string): Promise<ActionResult> {
    return this.handleActionInternal(userInput, ActionsSdkAssistant.prototype.StandardIntents.TEXT);
  }

  private handleActionInternal(userInput: string, intent: string): Promise<ActionResult> {
    const actionRequestJson = {
      'user': {
        'user_id': this.user.id,
      },
      'conversation': {
        'conversation_id': this.conversationId,
        'type': 'ACTIVE'
      },
      'inputs': [{
        'intent': intent,
        'raw_inputs': [
          {'query': userInput}
        ]
      }]
    };
    return new Promise((resolve, reject) => {
      this.request.post('/')
          .send(actionRequestJson)
          .expect(200)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              reject(err);
            } else {
              this.buildActionResultFromResponse(res).then(resolve);
            }
          });
    });
  }

  private static getSsmlFromResponseBody(body: any): string {
    if (body['expect_user_response']) {
      return body['expected_inputs'][0]['input_prompt']['initial_prompts'][0]['ssml'];
    } else {
      return body['final_response']['speech_response']['ssml'];
    }
  }

  private async buildActionResultFromResponse(response: supertest.Response): Promise<ActionResult> {
    const user = await this.databases.db!.loadOrGetDefaultUser(this.user.id);
    this.user = user;
    return {
      user: user,
      expectUserResponse: response.body['expect_user_response'],
      ssml: ActionsTestRunner.getSsmlFromResponseBody(response.body)
    };
  }
}