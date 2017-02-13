import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';
import {AppState} from '../../src/user';

describe('greeting action', wrapDatabase(function(databases) {

  it('should say "welcome to Rachel\'s English"', async function() {
    const runner = new ActionsTestRunner(databases);
    const result = await runner.openRachelsEnglish();
    assert.equal(result.user.heardFullGreeting, true);
    assert.include(result.ssml, 'Welcome to Rachel\'s English!',);
    assert.equal(result.user.appState, AppState.MainMenu);
  });

  it('for users coming back should say "welcome back"', async function() {
    const runner = new ActionsTestRunner(databases);
    // Call openRachelsEnglish twice to imitate repeated visit.
    await runner.openRachelsEnglish();
    const result = await runner.openRachelsEnglish();
    assert.include(result.ssml, 'Welcome back to Rachel\'s English!');
  });

  it('greeting action resets state session values', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.modifyUser((user) => {
      user.appState = AppState.Quit;
      user.currentLessonPart = 123;
      return user;
    });
    const result = await runner.openRachelsEnglish();
    assert.equal(result.user.appState, AppState.MainMenu);
    assert.equal(result.user.currentLessonPart, 0);
  });
}));