/// <reference path="libraries.d.ts" />

import {User, getDefaultUser} from './user';
import {Config} from "./config";
const createDatastore = require('@google-cloud/datastore');

export const USER_KIND = 'User';

/**
 * Generic interface for working with storing data in persistent database.
 */
export interface Database {

  /**
   * Saves user in DB and returns promise that is going to be resolved once operation finishes.
   */
  saveUser(user: User): Promise<void>;

  /**
   * Loads user from database. If user doesn't exist it returns default user instance with the provided id. Note
   * that the latter case the new user object might not be actually saved until saveUser() is called.
   */
  loadOrGetDefaultUser(userId: string): Promise<User>;
}

/**
 * Database based on Google Datastore
 * https://cloud.google.com/datastore/
 */
class GoogleDatastoreDatabase implements Database {
  datastore: any;

  constructor(config: Config) {
    this.datastore = createDatastore({
      projectId: config.gcloud.projectId,
      apiEndpoint: config.gcloud.datastoreEndpoint,
      namespace: config.gcloud.datastoreNamespace
    });
  }

  saveUser(user: User): Promise<void> {
    const key = this.keyForUser(user.id);
    return this.datastore.save({
      key: key,
      data: user
    });
  }

  loadOrGetDefaultUser(userId: string): Promise<User> {
    const key = this.keyForUser(userId);
    return this.datastore.get(key).then(
        (response: Array<User>) => {
          const user = response[0];
          return user ? user : getDefaultUser(userId);
        });
  }

  keyForUser(id: string): any {
    return this.datastore.key([USER_KIND, id]);
  }
}

export function createDatabase(config: Config): Database {
  return new GoogleDatastoreDatabase(config);
}