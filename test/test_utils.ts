import {Config, CONFIG} from "../src/config";
import {User} from '../src/user';
import * as db from '../src/db';
import {assert} from 'chai';
import * as http from 'http';
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
      if (users.length === 0) {
        return null;
      }
      const userKeys = users.map((user) => (<any>user)[createDatastore.KEY]);
      return this.datastore.delete(userKeys).then(() => {
        // There seems to be a bug when even if delete promise resolve - it doesn't mean that entries were deleted.
        // Might be a bug with datastore simulator. As a workaround we call deleteAllUsers again until everything
        // is deleted.
        return this.deleteAllUsers();
      });
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

function waitForDatabaseToBecomeAvailable(): Promise<void> {
  return new Promise<void>((resolve) => {
    const checkDatabaseUp = () => {
      http.get(TEST_CONFIG.gcloud.datastoreEndpoint, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(checkDatabaseUp, 100);
        }
      }).on('error', () => {
        setTimeout(checkDatabaseUp, 100);
      });
    };
    checkDatabaseUp();
  });
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

    before('setting up databases', async function () {
      // Setting up database might take time, for example waiting for
      // database to become available so increase timeout.
      this.timeout(5000);
      await waitForDatabaseToBecomeAvailable();
      databases.db = db.createDatabase(TEST_CONFIG);
      databases.dbHelper = new TestDbHelper(TEST_CONFIG);
      await databases.dbHelper.deleteAllUsers();
    });

    beforeEach('verify database is empty before each test', function () {
      return databases.dbHelper!.getAllUsers().then((users) => {
        assert.lengthOf(users, 0, `Got users: ${JSON.stringify(users)}`);
      });
    });

    afterEach('cleanup database after test', function () {
      return databases.dbHelper!.deleteAllUsers();
    });

    fn(databases);
  };
}