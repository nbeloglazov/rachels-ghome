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
     */
    datastoreEndpoint: string;

    /** namespace for datastore. Used to pick dev vs test vs prod profiles to store data */
    datastoreNamespace: string;
  };

  /** port on which http server runs */
  port: number;
}

/**
 * Default config for local development. Right now it is hardcoded here, though later we might load it from
 * json file but nice thing about hardcoding is that it can typechecked.
 */
export const CONFIG: Config = {
  gcloud: {
    projectId: 'rachels-ghome',
    datastoreEndpoint: 'http://localhost:8081',
    datastoreNamespace: 'dev'
  },
  port: 8080
};
