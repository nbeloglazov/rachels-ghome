
import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';

describe('help action', wrapDatabase(function(databases) {

  it('should contain "next lesson" and "random lesson" commands', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();
    const result = await runner.handleAction('help me');
    assert.include(result.ssml, 'play random lesson');
    assert.include(result.ssml, 'play next lesson');
  });
}));