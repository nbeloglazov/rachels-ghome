/**
 * Config representing customizable part of the application.
 */
export interface Config {
  /**
   * gcloud is section related to Google Cloud settings.
   */
  gcloud: {
    /** project id in google cloud */
    projectId: string;

    /**
     * endpoint of google datastore server. For local development it is localhost:8081 and you have to start
     * it using 'npm run start-dev-env' before starting app.
     * If null is passed - Google Cloud Datastore will be used.
     */
    datastoreEndpoint: string|null;

    /** namespace for datastore. Used to pick dev vs test vs prod profiles to store data */
    datastoreNamespace: string;
  };

  /** port on which http server runs */
  port: number;
}

export const IS_RUNNING_ON_APP_ENGINE = Boolean(process.env.GAE_INSTANCE);

/**
 * Default config. Right now it is hardcoded in this file, though later we might load it from
 * json file but nice thing about hardcoding is that it can typechecked.
 */
export const CONFIG: Config = {
  gcloud: {
    projectId: 'rachels-ghome',
    datastoreEndpoint: IS_RUNNING_ON_APP_ENGINE ? null : 'http://localhost:8081',
    datastoreNamespace: IS_RUNNING_ON_APP_ENGINE ? 'prod' : 'dev'
  },
  port: parseInt(process.env.PORT, 10) || 8080
};
