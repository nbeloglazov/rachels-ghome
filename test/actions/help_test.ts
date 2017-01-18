
import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';

describe('help action', wrapDatabase(function(databases) {

  it('should contain "next lesson" and "random lesson" commands', function() {
    const runner = new ActionsTestRunner(databases);
    return runner.handleAction('help me').then((result) => {
      assert.include(result.ssml, 'play random lesson');
      assert.include(result.ssml, 'play next lesson');
    });
  });
}));