import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';

describe('greeting action', wrapDatabase(function(databases) {

  it('should say "welcome to Rachel\'s English"', function() {
    const runner = new ActionsTestRunner(databases);
    return runner.handleAction('').then((result) => {
      assert.equal(result.user.heardFullGreeting, true);
      assert.include(result.ssml, 'Welcome to Rachel\'s English!',);
    });
  });

  it('for users coming back should say "welcome back"', function() {
    const runner = new ActionsTestRunner(databases);
    return runner
        .modifyUser((user) => {
          user.heardFullGreeting = true;
          return user;
        })
        .then(() => runner.handleAction(''))
        .then((result) => {
          assert.include(result.ssml, 'Welcome back to Rachel\'s English!');
        });
  });
}));