import * as assert from 'assert';
import {add} from '../src/main';

describe('add', function() {
  it('works', function() {
    assert.equal(5, add(2, 3));
  });
});