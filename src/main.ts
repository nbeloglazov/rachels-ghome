import {User} from './user';

const user: User = {id: '12345', lastActionTimestampMs: 0, heardFirstGreeting: false};
console.log(user);

export function add(a: number, b: number): number {
  return a + b;
}
