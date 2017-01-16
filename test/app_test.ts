import {assert} from 'chai';
import {ACTION_HANDLERS, createApp} from '../src/app';
import {ActionType} from '../src/actions';
import {TEST_CONFIG} from './test_config';
import {createDatabase} from '../src/db';
import * as supertest from 'supertest';

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
  });
});

describe('app', function() {
  const db = createDatabase(TEST_CONFIG);

  it('should return index page', function() {
    return supertest(createApp(db))
        .get('/')
        .expect(/Up and running!/)
        .expect(200);
  });

  it('should increase number of processed requests with each POST', function() {
    const request = supertest(createApp(db));
    return Promise.resolve()
        .then(() => {
          return request.get('/').expect(/0 voice requests/).expect(200);
        }).then(() => {
          return request.post('/');
        }).then(() => {
          return request.get('/').expect(/1 voice requests/).expect(200);
        }).then(() => {
          return request.post('/');
        }).then(() => {
          return request.post('/');
        }).then(() => {
          return request.get('/').expect(/3 voice requests/).expect(200);
        });
  });
});