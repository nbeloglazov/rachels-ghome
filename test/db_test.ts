import {assert} from 'chai';
import {wrapDatabase} from "./test_utils";
import {getDefaultUser} from "../src/user";


describe('db', wrapDatabase(function(databases) {

  it('should return default user when id does not exist', async function() {
    const id = '1';
    const user = await databases.db!.loadOrGetDefaultUser(id);
    assert.deepEqual(user, getDefaultUser(id));
  });

  it('should save changes to user', async function() {
    const id = '2';
    let user = await databases.db!.loadOrGetDefaultUser(id);
    user.lastActionTimestampMs = 567;
    user.heardFullGreeting = true;
    await databases.db!.saveUser(user);
    user = await databases.db!.loadOrGetDefaultUser(id);
    assert.equal(user.id, id);
    assert.equal(user.lastActionTimestampMs, 567);
    assert.equal(user.heardFullGreeting, true);

    user.lastActionTimestampMs = 1111;
    await databases.db!.saveUser(user);
    user = await databases.db!.loadOrGetDefaultUser(id);
    assert.equal(user.lastActionTimestampMs, 1111)
  });

  it('should save multiple users', async function() {
    const id1 = '3';
    const user1 = getDefaultUser(id1);
    user1.lastActionTimestampMs = 818181;
    const id2 = '4';
    const user2 = getDefaultUser(id2);
    user2.lastActionTimestampMs = 333333;
    await databases.db!.saveUser(user1);
    await databases.db!.saveUser(user2);
    let user = await databases.db!.loadOrGetDefaultUser(id1);
    assert.equal(user.lastActionTimestampMs, user1.lastActionTimestampMs);
    user = await databases.db!.loadOrGetDefaultUser(id2);
    assert.equal(user.lastActionTimestampMs, user2.lastActionTimestampMs);
  });
}));