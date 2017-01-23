import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';
import {AppState} from '../../src/user';
import {getRandomLesson} from '../../src/actions/play_random_lesson';

describe('play random lesson action', wrapDatabase(function(databases) {

  it('should contain <audio> tag and should not change lesson progress', function() {
    const runner = new ActionsTestRunner(databases);
    return runner
        .openRachelsEnglish()
        .then((result) => {
          assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
        })

        // User requested to play random lesson
        .then(() => runner.handleAction('play random lesson'))
        .then((result) => {
          assert.include(result.ssml, '<audio src=');
          assert.equal(result.user.appState, AppState.MainMenu);
          // Random lesson action should not affect user progress.
          assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
          assert.equal(result.expectUserResponse, true);
        })

        // User requested to play another random lesson
        .then(() => runner.handleAction('play random lesson'))
        .then((result) => {
          assert.include(result.ssml, '<audio src=');
          assert.equal(result.user.appState, AppState.MainMenu);
          // Random lesson action should not affect user progress.
          assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
          assert.equal(result.expectUserResponse, true);
        })

        // And user is done with lessons and wants to quit.
        .then(() => runner.handleAction('quit'))
        .then((result) => {
          assert.equal(result.user.appState, AppState.Quit);
          // Progress is still 0.
          assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
          assert.equal(result.expectUserResponse, false);
        });
  });
}));

describe('getRandomLesson function', function() {
  it ('should return non-null lesson every time', function() {
    const lessons: Set<string> = new Set();
    for (let i = 0; i < 1000; i++) {
      const lesson = getRandomLesson();
      assert.isDefined(lesson);
      lessons.add(lesson.name);
    }
    assert.isAtLeast(lessons.size, 2);
  });
});
