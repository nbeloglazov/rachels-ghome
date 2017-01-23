import {wrapDatabase} from '../test_utils';
import {ActionsTestRunner} from './actions_test_runner';
import {assert} from 'chai';
import {AppState} from '../../src/user';
import {THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE} from '../../src/lessons';

describe('play next lesson action', wrapDatabase(function(databases) {

  it('should contain <audio> tag and increase progress after user reply', function() {
    const runner = new ActionsTestRunner(databases);
    return runner
        .openRachelsEnglish()
        .then((result) => {
          assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
        })

        // User requested to play next lesson
        .then(() => runner.handleAction('play next lesson'))
        .then((result) => {
          assert.include(result.ssml, '<audio src=');
          assert.equal(result.user.appState, AppState.MainMenu);
          // We just send lesson back to user and need any user response after lesson ends to mark it as completed.
          // So for now progress is still 0.
          assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
          assert.equal(result.expectUserResponse, true);
        })

        // User requested to another lesson again
        .then(() => runner.handleAction('play next lesson'))
        .then((result) => {
          assert.include(result.ssml, '<audio src=');
          assert.equal(result.user.appState, AppState.MainMenu);
          // We should mark only the first lesson as completed, but not the second one yet.
          assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);
          assert.equal(result.expectUserResponse, true);
        })

        // And user is done with lessons and wants to quit.
        .then(() => runner.handleAction('quit'))
        .then((result) => {
          assert.equal(result.user.appState, AppState.Quit);
          // Now both lessons marked as completed.
          assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 2);
          assert.equal(result.expectUserResponse, false);
        });
  });

  it('should not play audio if user reached the end of the course', function() {
    const runner = new ActionsTestRunner(databases);
    return runner
        .openRachelsEnglish()
        // Imitate user completed all lessons
        .then(() => runner.modifyUser((user) => {
          user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge = THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE.length;
          return user;
        }))
        .then(() => runner.handleAction('play next lesson'))
        .then((result) => {
          assert.notInclude(result.ssml, '<audio src=');
          assert.equal(result.user.appState, AppState.MainMenu);
          assert.equal(result.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge,
              THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE.length);
          assert.equal(result.expectUserResponse, true);
        });
  });
}));
