import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';
import {AppState} from '../../src/user';
import {THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE} from '../../src/lessons';

describe('play next lesson action', wrapDatabase(function(databases) {

  it('should mark lesson as completed only after "done"', async function() {
    const runner = new ActionsTestRunner(databases);
    let result = await runner.openRachelsEnglish();
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);

    // User requested to play next lesson
    result = await runner.handleAction('play next lesson');
    assert.include(result.ssml, '<audio src=');
    assert.equal(result.user.appState, AppState.AwatingLessonCompleteConfirmation);
    // We just send lesson back to user and need any user response after lesson ends to mark it as completed.
    // So for now progress is still 0.
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
    assert.equal(result.expectUserResponse, true);

    // User marks lesson as completed.
    result = await runner.handleAction('done');
    assert.include(result.ssml, 'marked as completed');
    assert.include(result.ssml, 'do next?');
    assert.equal(result.user.appState, AppState.MainMenu);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);
    assert.equal(result.expectUserResponse, true);

    // User want's to play another lesson
    result = await runner.handleAction('play next lesson');
    assert.include(result.ssml, '<audio src=');
    assert.equal(result.user.appState, AppState.AwatingLessonCompleteConfirmation);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);
    assert.equal(result.expectUserResponse, true);

    // And then user leaves. Lesson should not be marked as completed.
    result = await runner.handleAction('quit');
    assert.equal(result.user.appState, AppState.Quit);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);
  });

  it('doing "play next lesson" twice without completion confiration should return same lesson', async function() {
    const runner = new ActionsTestRunner(databases);
    let result = await runner.openRachelsEnglish();
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);

    // User requested to play next lesson
    result = await runner.handleAction('play next lesson');
    const firstLesson = result.ssml;
    assert.include(result.ssml, '<audio src=');
    assert.equal(result.user.appState, AppState.AwatingLessonCompleteConfirmation);
    // We just send lesson back to user and need any user response after lesson ends to mark it as completed.
    // So for now progress is still 0.
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
    assert.equal(result.expectUserResponse, true);

    // User requested to another lesson again
    result = await runner.handleAction('play next lesson');
    assert.equal(result.user.appState, AppState.AwatingLessonCompleteConfirmation);
    // We should mark only the first lesson as completed, but not the second one yet.
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
    assert.equal(result.expectUserResponse, true);
    assert.equal(firstLesson, result.ssml);
  });

  it('should not update progress if user quits app in the middle of the lesson', async function() {
    const runner = new ActionsTestRunner(databases);
    let result = await runner.openRachelsEnglish();
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
    await runner.handleAction('play next lesson');

    // To imitate that user left app we open just pretend use "opened" it again as there is no "quit" callback provided
    // by sdk.
    result = await runner.openRachelsEnglish();
    // Progress should not have been updated
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
  });

  it('should not play audio if user reached the end of the course', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();

    // Imitate user completed all lessons
    await runner.modifyUser((user) => {
      user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge = THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE.length;
      return user;
    });

    const result = await runner.handleAction('play next lesson');
    assert.notInclude(result.ssml, '<audio src=');
    assert.equal(result.user.appState, AppState.MainMenu);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge,
        THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE.length);
    assert.equal(result.expectUserResponse, true);
  });
}));
