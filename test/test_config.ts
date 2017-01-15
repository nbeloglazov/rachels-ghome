import {Config, CONFIG} from "../src/config";

export const TEST_CONFIG: Config = Object.assign(CONFIG);
TEST_CONFIG.gcloud.datastoreNamespace = 'test';