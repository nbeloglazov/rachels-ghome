import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';
import {AppState, getDefaultUser} from '../../src/user';
import {getRandomLessonIndex} from '../../src/actions/play_random_lesson';

describe('play random lesson action', wrapDatabase(function(databases) {

  it('should contain <audio> tag and should not change lesson progress', async function() {
    const runner = new ActionsTestRunner(databases);
    let result = await runner.openRachelsEnglish();
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);


    // Set randomNumber to 0 so that "getRandomLessonIndex" will return the first lesson which has only 1 part.
    await runner.modifyUser((user) => {
      user.debugOptions.randomNumber = 0;
      return user;
    });

    // User requested to play random lesson
    result = await runner.handleAction('play random lesson');
    assert.include(result.ssml, '<audio src=');
    assert.equal(result.user.appState, AppState.MainMenu);
    // Random lesson action should not affect user progress.
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
    assert.equal(result.expectUserResponse, true);

    // User requested to play another random lesson
    result = await runner.handleAction('play random lesson');
    assert.include(result.ssml, '<audio src=');
    assert.equal(result.user.appState, AppState.MainMenu);
    // Random lesson action should not affect user progress.
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
    assert.equal(result.expectUserResponse, true);

    // And user is done with lessons and wants to quit.
    result = await runner.handleAction('quit');
    assert.equal(result.user.appState, AppState.Quit);
    // Progress is still 0.
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
    assert.equal(result.expectUserResponse, false);
  });

  it('should play multi part lessons', async function() {
    const runner = new ActionsTestRunner(databases);
    await runner.openRachelsEnglish();

    // Set randomNumber to 1 so that "getRandomLessonIndex" will return the second lesson. Only the second lesson
    // has 3 parts and suitable for our purposes.
    await runner.modifyUser((user) => {
      user.debugOptions.randomNumber = 1;
      return user;
    });

    // User asks for the random lesson and gets the first part of the lesson.
    let result = await runner.handleAction('play random lesson');
    assert.include(result.ssml, 'lesson2_1.mp3');
    assert.include(result.ssml.toLowerCase(), 'say "yes" to continue');
    assert.equal(result.user.currentLessonPart, 0);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);

    // User says "yes" and gets the second part.
    result = await runner.handleAction('yes');
    assert.include(result.ssml, 'lesson2_2.mp3');
    assert.include(result.ssml.toLowerCase(), 'say "yes" to continue');
    assert.equal(result.user.currentLessonPart, 1);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);

    result = await runner.handleAction('yes');
    assert.include(result.ssml, 'lesson2_3.mp3');
    assert.equal(result.user.appState, AppState.MainMenu);
    assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
  });
}));

describe('getRandomLessonIndex function', function() {
  it ('should return non-null lesson every time', function() {
    const lessons: Set<number> = new Set();
    for (let i = 0; i < 1000; i++) {
      const lesson = getRandomLessonIndex(getDefaultUser('123'));
      assert.isDefined(lesson);
      lessons.add(lesson);
    }
    assert.isAtLeast(lessons.size, 2);
  });
});
