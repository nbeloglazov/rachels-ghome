
import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';

describe('debug mode action', wrapDatabase(function(databases) {

  it('action "debug" should enable debug', async function() {
    const runner = new ActionsTestRunner(databases);
    let result = await runner.openRachelsEnglish();

    // debug mode disabled
    assert.isFalse(result.user.debugOptions.useShortDebugLesson);

    // enabling debug
    result = await runner.handleAction('debug');
    assert.include(result.ssml, 'debug mode enabled');
    assert.isTrue(result.expectUserResponse);
    assert.isTrue(result.user.debugOptions.useShortDebugLesson);
  });

  it('repeated "debug" should disable debug', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();
    await runner.modifyUser((user) => {
      user.debugOptions.useShortDebugLesson = true;
      return user;
    });

    // disabling debug
    const result = await runner.handleAction('debug');
    assert.include(result.ssml, 'debug mode disabled');
    assert.isTrue(result.expectUserResponse);
    assert.isFalse(result.user.debugOptions.useShortDebugLesson);
  });

  it('debug mode should reset on false on login', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();

    let result = await runner.handleAction('debug');
    assert.include(result.ssml, 'debug mode enabled');
    assert.isTrue(result.expectUserResponse);
    assert.isTrue(result.user.debugOptions.useShortDebugLesson);

    // Imitate user leaving and joining again. Session should reset.
    result = await runner.openRachelsEnglish();
    assert.isTrue(result.expectUserResponse);
    assert.isFalse(result.user.debugOptions.useShortDebugLesson);
  });
}));