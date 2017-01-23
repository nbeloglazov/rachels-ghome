import {assert} from 'chai';
import {executePreActionHook} from '../src/hooks';
import {getDefaultUser, PreActionHook} from '../src/user';
import {THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE} from '../src/lessons';

describe('executePreActionHook', function() {
  it('should handle UpdateLessonsProgress hook', function() {
    let user = getDefaultUser('123');
    assert.equal(user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 0);
    user = executePreActionHook(PreActionHook.UpdateLessonsProgress, user);
    assert.equal(user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, 1);

    user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge = THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE.length;
    user = executePreActionHook(PreActionHook.UpdateLessonsProgress, user);
    assert.equal(user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge, THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE.length);
  });
});