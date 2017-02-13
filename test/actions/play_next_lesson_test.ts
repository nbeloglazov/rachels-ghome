import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';
import {AppState} from '../../src/user';
import {getCourse} from '../../src/lessons';

describe('play next lesson action', wrapDatabase(function(databases) {

  it('should mark lesson as completed only after "done"', async function() {
    const runner = new ActionsTestRunner(databases);
    let result = await runner.openRachelsEnglish();
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);

    // User requested to play next lesson
    result = await runner.handleAction('play next lesson');
    assert.include(result.ssml, '<audio src=');
    assert.equal(result.user.appState, AppState.AwaitingNextLessonCompleteConfirmation);
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
    assert.equal(result.user.appState, AppState.AwaitingNextLessonCompleteConfirmation);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);
    assert.equal(result.expectUserResponse, true);

    // And then user leaves. Lesson should not be marked as completed.
    result = await runner.handleAction('quit');
    assert.equal(result.user.appState, AppState.Quit);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);
  });

  it('doing "play next lesson" twice without completion confirmation should return same lesson', async function() {
    const runner = new ActionsTestRunner(databases);
    let result = await runner.openRachelsEnglish();
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);

    // User requested to play next lesson
    result = await runner.handleAction('play next lesson');
    const firstLesson = result.ssml;
    assert.include(result.ssml, '<audio src=');
    assert.equal(result.user.appState, AppState.AwaitingNextLessonCompleteConfirmation);
    // We just send lesson back to user and need any user response after lesson ends to mark it as completed.
    // So for now progress is still 0.
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
    assert.equal(result.expectUserResponse, true);

    // User requested to another lesson again
    result = await runner.handleAction('play next lesson');
    assert.equal(result.user.appState, AppState.AwaitingNextLessonCompleteConfirmation);
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
      user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge = getCourse(user).length;
      return user;
    });

    const result = await runner.handleAction('play next lesson');
    assert.notInclude(result.ssml, '<audio src=');
    assert.equal(result.user.appState, AppState.MainMenu);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge,
        getCourse(result.user).length);
    assert.equal(result.expectUserResponse, true);
  });

  ['yes', 'done', 'completed'].forEach((word) => {
    it('should accept "' + word + '" as completion word', async function() {
      const runner = new ActionsTestRunner(databases);
      await runner.openRachelsEnglish();

      let result = await runner.handleAction('play next lesson');
      assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);

      result = await runner.handleAction(word);
      assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);
    });
  });

  it('should ask for "yes" for multi-part lessons and mark as them as completed only after the last part',
      async function() {
        const runner = new ActionsTestRunner(databases);
        await runner.openRachelsEnglish();

        // Set current lesson the second lesson which has 3 parts.
        await runner.modifyUser((user) => {
          user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge = 1;
          return user;
        });

        // User asks for the next lesson and gets the first part of the lesson.
        let result = await runner.handleAction('play next lesson');
        assert.include(result.ssml, 'lesson2_1.mp3');
        assert.include(result.ssml.toLowerCase(), 'say "yes" to continue');
        assert.equal(result.user.currentLessonPart, 0);
        assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);

        // User says "yes" and gets the second part.
        result = await runner.handleAction('yes');
        assert.include(result.ssml, 'lesson2_2.mp3');
        assert.include(result.ssml.toLowerCase(), 'say "yes" to continue');
        assert.equal(result.user.currentLessonPart, 1);
        assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);

        // User says "yes" and gets the third part.
        result = await runner.handleAction('yes');
        assert.include(result.ssml, 'lesson2_3.mp3');
        assert.include(result.ssml.toLowerCase(), 'say "yes" to complete');
        assert.equal(result.user.currentLessonPart, 2);
        assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);

        // User says "yes" and finally lesson marked as completed.
        result = await runner.handleAction('yes');
        assert.include(result.ssml, 'marked as completed');
        assert.include(result.ssml, 'do next?');
        assert.equal(result.user.currentLessonPart, 0);
        assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 2);
      });


  it('should reset current part number if user interrupts the lesson in the middle', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();

    // Set current lesson the second lesson which has 3 parts.
    await runner.modifyUser((user) => {
      user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge = 1;
      return user;
    });

    // User asks for the next lesson and gets the first part of the lesson.
    let result = await runner.handleAction('play next lesson');
    assert.include(result.ssml, 'lesson2_1.mp3');
    assert.include(result.ssml.toLowerCase(), 'say "yes" to continue');
    assert.equal(result.user.currentLessonPart, 0);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);

    // User says "yes" and gets the second part.
    result = await runner.handleAction('yes');
    assert.include(result.ssml, 'lesson2_2.mp3');
    assert.include(result.ssml.toLowerCase(), 'say "yes" to continue');
    assert.equal(result.user.currentLessonPart, 1);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);

    // All of a sudden user want tells to play next lesson again. We should just restart the current lesson.
    result = await runner.handleAction('play next lesson');
    assert.include(result.ssml, 'lesson2_1.mp3');
    assert.include(result.ssml.toLowerCase(), 'say "yes" to continue');
    assert.equal(result.user.currentLessonPart, 0);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);
  });
}));
