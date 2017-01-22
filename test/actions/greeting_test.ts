import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';
import {AppState} from '../../src/user';

describe('greeting action', wrapDatabase(function(databases) {

  it('should say "welcome to Rachel\'s English"', function() {
    const runner = new ActionsTestRunner(databases);
    return runner.openRachelsEnglish().then((result) => {
      assert.equal(result.user.heardFullGreeting, true);
      assert.include(result.ssml, 'Welcome to Rachel\'s English!',);
      assert.equal(result.user.appState, AppState.MainMenu);
    });
  });

  it('for users coming back should say "welcome back"', function() {
    const runner = new ActionsTestRunner(databases);
    return runner
        // Call openRachelsEnglish twice to imitate repeated visit.
        .openRachelsEnglish()
        .then(() => runner.openRachelsEnglish())
        .then((result) => {
          assert.include(result.ssml, 'Welcome back to Rachel\'s English!');
        });
  });

  it('greeting action resets state to main menu', function() {
    const runner = new ActionsTestRunner(databases);
    return runner
        .modifyUser((user) => {
          user.appState = AppState.Quit;
          return user;
        })
        .then(() => runner.openRachelsEnglish())
        .then((result) => {
          assert.equal(result.user.appState, AppState.MainMenu);
        })
  })
}));