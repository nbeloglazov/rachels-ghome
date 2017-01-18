import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';

describe('don\'t understand action', wrapDatabase(function(databases) {
  it('should contain "help" word', function() {
    const runner = new ActionsTestRunner(databases);
    return runner.openRachelsEnglish()
        .then(() => runner.handleAction('bla bla bla'))
        .then((result) => {
          assert.include(result.ssml.toLowerCase(), 'sorry');
          assert.include(result.ssml.toLowerCase(), 'say "help"');
        });
  });
}));