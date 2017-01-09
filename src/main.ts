/// <reference path="actions_on_google.d.ts" />

import {User} from './user';
import {ActionsSdkAssistant} from 'actions-on-google';

const user: User = {id: '12345', lastActionTimestampMs: 0, heardFirstGreeting: false};
console.log(user);

console.log(new ActionsSdkAssistant({request: {get: function() {}}, response: {}}));

export function add(a: number, b: number): number {
  return a + b;
}
