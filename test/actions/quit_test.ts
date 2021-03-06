import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';
import {AppState} from '../../src/user';

describe('quit action', wrapDatabase(function(databases) {

  it('should quit', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();
    const result = await runner.handleAction('quit');
    assert.include(result.ssml, 'See you later');
    assert.equal(result.expectUserResponse, false);
    assert.equal(result.user.appState, AppState.Quit);
  });
}));