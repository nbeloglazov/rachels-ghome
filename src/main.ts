import {createApp} from './app';

const app = createApp();
const server = app.listen(8080, function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});
