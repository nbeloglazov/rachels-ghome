import {createApp} from './app';
import {createDatabase} from './db';
import {CONFIG} from './config';

const app = createApp(createDatabase(CONFIG));
const server = app.listen(CONFIG.port, function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});
