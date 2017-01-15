import {assert} from 'chai';
import * as db from "../src/db";
import {TEST_CONFIG} from "./test_config";
import {getDefaultUser} from "../src/user";
const createDatastore = require('@google-cloud/datastore');


describe('db', function() {

  let database: db.Database;

  // This db is for using datastore API directly for things like cleaning up between tests.
  let utilDb: any;

  before(function() {
    database = db.createDatabase(TEST_CONFIG);
    utilDb = createDatastore({
      projectId: TEST_CONFIG.gcloud.projectId,
      apiEndpoint: TEST_CONFIG.gcloud.datastoreEndpoint,
      namespace: TEST_CONFIG.gcloud.datastoreNamespace
    });
  });

  beforeEach(function() {
    const query = utilDb.createQuery(db.USER_KIND);
    return utilDb.runQuery(query).then((result: Array<any>) => {
      const entities = result[0];
      assert.lengthOf(entities, 0);
    });
  });

  afterEach(function() {
    const query = utilDb.createQuery(db.USER_KIND);
    return utilDb.runQuery(query).then((result: Array<any>) => {
      const entityKeys = result[0].map((entity: any) => entity[createDatastore.KEY]);
      return utilDb.delete(entityKeys);
    });
  });

  it('should return default user when id does not exist', function() {
    const id = '1';
    return database.loadOrGetDefaultUser(id).then((user) => {
      assert.deepEqual(user, getDefaultUser(id));
    });
  });

  it('should save changes to user', function() {
    const id = '2';
    return database.loadOrGetDefaultUser(id)
        .then((user) => {
          user.lastActionTimestampMs = 567;
          user.heardFullGreeting = true;
          return database.saveUser(user);
        })
        .then(() => database.loadOrGetDefaultUser(id))
        .then((user) => {
          assert.equal(user.id, id);
          assert.equal(user.lastActionTimestampMs, 567);
          assert.equal(user.heardFullGreeting, true);

          user.lastActionTimestampMs = 1111;
          return database.saveUser(user);
        })
        .then(() => database.loadOrGetDefaultUser(id))
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
    return database.saveUser(user1)
        .then(() => database.saveUser(user2))
        .then(() => database.loadOrGetDefaultUser(id1))
        .then((user) => {
          assert.equal(user.lastActionTimestampMs, user1.lastActionTimestampMs);
        })
        .then(() => database.loadOrGetDefaultUser(id2))
        .then((user) => {
          assert.equal(user.lastActionTimestampMs, user2.lastActionTimestampMs);
        });
  });
});