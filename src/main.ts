import {createApp} from './app';
import {createDatabase} from './db';
import {CONFIG} from './config';
import * as VoiceInsights from 'voicelabs-assistant-sdk';

const app = createApp(createDatabase(CONFIG), CONFIG);
const server = app.listen(CONFIG.port, function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');

  if (CONFIG.voiceLabsAppToken != null) {
    VoiceInsights.initialize(CONFIG.voiceLabsAppToken);
  }
});
