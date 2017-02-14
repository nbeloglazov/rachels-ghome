import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';

describe('don\'t understand action', wrapDatabase(function(databases) {
  it('should contain "help" word', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();
    const result = await runner.handleAction('bla bla bla');
    assert.include(result.ssml.toLowerCase(), 'sorry');
    assert.include(result.ssml.toLowerCase(), 'say "help"');
  });

  it('should contain "yes to continue" when in the middle of "next" lesson', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();

    // Set user to the middle of the second lesson which has 3 parts.
    await runner.modifyUser((user) => {
      user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge = 1;
      return user;
    });

    // Start lesson.
    let result = await runner.handleAction('play next lesson');
    assert.include(result.ssml, `"yes" to continue`);

    // And say something random.
    result = await runner.handleAction('bla bla bla');
    assert.include(result.ssml.toLowerCase(), `sorry`);
    assert.include(result.ssml.toLowerCase(), `"yes"`);
    assert.include(result.ssml.toLowerCase(), `to continue`);
  });

  it('should contain "yes to continue" when in the middle of "random" lesson', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();

    // Set user to the middle of the second lesson which has 3 parts.
    await runner.modifyUser((user) => {
      user.debugOptions.randomNumber = 1;
      return user;
    });

    // Start lesson.
    let result = await runner.handleAction('play random lesson');
    assert.include(result.ssml, `"yes" to continue`);

    // And say something random.
    result = await runner.handleAction('bla bla bla');
    assert.include(result.ssml.toLowerCase(), `sorry`);
    assert.include(result.ssml.toLowerCase(), `"yes"`);
    assert.include(result.ssml.toLowerCase(), `to continue`);
  });

  it('should contain "yes to complete" when at the end of "next" lesson', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();

    // Start lesson.
    let result = await runner.handleAction('play next lesson');
    assert.include(result.ssml, `"yes" to complete`);

    // And say something random.
    result = await runner.handleAction('bla bla bla');
    assert.include(result.ssml.toLowerCase(), `sorry`);
    assert.include(result.ssml.toLowerCase(), `"yes"`);
    assert.include(result.ssml.toLowerCase(), `to complete`);
  });
}));