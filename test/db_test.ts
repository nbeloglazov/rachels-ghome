import {assert} from 'chai';
import {wrapDatabase} from "./test_utils";
import {getDefaultUser} from "../src/user";


describe('db', wrapDatabase(function(databases) {

  it('should return default user when id does not exist', function() {
    const id = '1';
    return databases.db!.loadOrGetDefaultUser(id).then((user) => {
      assert.deepEqual(user, getDefaultUser(id));
    });
  });

  it('should save changes to user', function() {
    const id = '2';
    return databases.db!.loadOrGetDefaultUser(id)
        .then((user) => {
          user.lastActionTimestampMs = 567;
          user.heardFullGreeting = true;
          return databases.db!.saveUser(user);
        })
        .then(() => databases.db!.loadOrGetDefaultUser(id))
        .then((user) => {
          assert.equal(user.id, id);
          assert.equal(user.lastActionTimestampMs, 567);
          assert.equal(user.heardFullGreeting, true);

          user.lastActionTimestampMs = 1111;
          return databases.db!.saveUser(user);
        })
        .then(() => databases.db!.loadOrGetDefaultUser(id))
        .then((user) => {
          assert.equal(user.lastActionTimestampMs, 1111)
        });
  });

  it('should save multiple users', function() {
    const id1 = '3';
    const user1 = getDefaultUser(id1);
    user1.lastActionTimestampMs = 818181;
    const id2 = '4';
    const user2 = getDefaultUser(id2);
    user2.lastActionTimestampMs = 333333;
    return databases.db!.saveUser(user1)
        .then(() => databases.db!.saveUser(user2))
        .then(() => databases.db!.loadOrGetDefaultUser(id1))
        .then((user) => {
          assert.equal(user.lastActionTimestampMs, user1.lastActionTimestampMs);
        })
        .then(() => databases.db!.loadOrGetDefaultUser(id2))
        .then((user) => {
          assert.equal(user.lastActionTimestampMs, user2.lastActionTimestampMs);
        });
  });
}));