import {Config, CONFIG} from "../src/config";
import {User} from '../src/user';
import * as db from '../src/db';
import {assert} from 'chai';
const createDatastore = require('@google-cloud/datastore');

export const TEST_CONFIG: Config = Object.assign(CONFIG);
TEST_CONFIG.gcloud.datastoreNamespace = 'test';

/**
 * Helper class that provides methods for cleaning up, querying data which
 * is not available in Database interface. To be used in tests for cleaning up/
 * assertions.
 */
export class TestDbHelper {
  datastore: any;

  constructor(config: Config) {
    this.datastore = createDatastore({
        projectId: config.gcloud.projectId,
        apiEndpoint: config.gcloud.datastoreEndpoint,
        namespace: config.gcloud.datastoreNamespace
    });
  }

  getAllUsers(): Promise<Array<User>> {
    const query = this.datastore.createQuery(db.USER_KIND);
    return this.datastore.runQuery(query).then((result: Array<any>) => {
      return result[0];
    });
  }

  deleteAllUsers(): Promise<void> {
    return this.getAllUsers().then((users) => {
      const userKeys = users.map((user) => (<any>user)[createDatastore.KEY]);
      return this.datastore.delete(userKeys);
    });
  }
}

/**
 * Object holding instances of test databases to be used in tests.
 */
export interface TestDatabases {
  db: db.Database|null;
  dbHelper: TestDbHelper|null;
}

/**
 * Middleware that adds database for testing and sets up hooks so that database is cleaned between tests. Usage:
 *
 * describe('somesting', wrapDatabase(function(databases) {
 *   it('should do stuff', function() {
 *     ...
 *     databases.db.getUser();
 *   });
 * }));
 */
export function wrapDatabase(fn: (databases: TestDatabases) => void): () => void {
  return function() {
    const databases: TestDatabases = {
      db: null,
      dbHelper: null
    };

    before('setting up databases', function () {
      databases.db = db.createDatabase(TEST_CONFIG);
      databases.dbHelper = new TestDbHelper(TEST_CONFIG);
      return databases.dbHelper.deleteAllUsers();
    });

    beforeEach('verify database is empty before each test', function () {
      return databases.dbHelper!.getAllUsers().then((users) => {
        assert.lengthOf(users, 0);
      });
    });

    afterEach('cleanup database after test', function () {
      return databases.dbHelper!.deleteAllUsers();
    });

    fn(databases);
  };
}