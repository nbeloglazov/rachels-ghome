import {PreActionHook, User} from './user';

/**
 * Execute preaction hook on user state which should return the updated user state. Hook execution is side-effect free
 * action, it should not read/change any global state like DB. All the necessary data should be in User object.
 *
 * See PreActionHook description in 'user.ts' for description of what hooks are.
 */
export function executePreActionHook(hookType: PreActionHook, _: User): User {
  switch (hookType) {
    default:
      throw new Error('Unknown hook type: ' + hookType);
  }
}