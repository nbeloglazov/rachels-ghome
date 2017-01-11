import {assert} from 'chai';
import {ACTION_HANDLERS} from '../src/app';
import {ActionType} from '../src/actions';

describe('action handlers', function() {
  it('should have different types for all handlers', function() {
    const types: Set<ActionType> = new Set();
    ACTION_HANDLERS.forEach((handler) => {
      if (types.has(handler.getType())) {
        assert.fail(0, 0, `Found 2 handlers with type: ${handler.getType()}`);
      }
      types.add(handler.getType());
    });
  });

  it('size should match number of values in ActionType', function() {
    let actionTypeSize = 0;
    for (const _ in ActionType) {
      actionTypeSize++;
    }
    // Typescript compiles enum into object with mapping both key => value and value => so object contains 2x entries.
    actionTypeSize /= 2;
    assert.lengthOf(ACTION_HANDLERS, actionTypeSize);
  })
});