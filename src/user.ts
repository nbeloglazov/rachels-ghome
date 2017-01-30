/**
 * Enum representing possible "locations" in the app. Like user in main menu, just listened to a lesson
 */
export enum AppState {
  MainMenu, Quit, AwatingLessonCompleteConfirmation
}

/**
 * Interface that contains user's progress in various courses.
 */
export interface CoursesProgressMap {
  thirtyDaysPhrasalVerbsChallenge: number;
}

/**
 * Enums that represent a set of logic that must be performed before actual action happens. Every action can return
 * a list of hooks to be executed next time processing input from user in current session. So it's like "onUserResponse"
 * callback.
 *
 * Example: google actions sdk  doesn't notify us when user finished listening to lesson but we need it to know it in
 * order to mark the lesson as completed. So we're doing this pre-action hook hack: when NextLessonAction returns
 * response it adds UpdateLessonProgress hook so that the next time user says anything in this session we can update
 * the user lesson progress. And we don't care what user says, we just need to know that the user is still there so
 * hook will be executed regardless what user says.
  */
export enum PreActionHook {
  UpdateLessonsProgress
}

/**
 * Interface representing user. For now it's a kitchen sync for all fields that are stored in DB. If you need to store
 * something in DB - add new field here and use it in ActionHandler.
 */
export interface User {
  /** User id passed from ghome sdk: https://developers.google.com/actions/reference/conversation#User */
  id: string;

  /**
   * The last time user did some voice action in ms since 1 January 1970. Note that when you're processing request
   * this number will refer to the previous user action, not the current so you can calculate the difference between
   * now and then by using Date.now() - lastActionTimestampMs
   */
  lastActionTimestampMs: number;

  /**
   * Defines whether user already heard initial full-form greeting and it can be skipped for follow up visits.
   */
  heardFullGreeting: boolean;

  appState: AppState;

  coursesProgressMap: CoursesProgressMap;

  /** See PreActionHook description for more info */
  preActionsHooks?: Array<PreActionHook>
}

export function getDefaultUser(userId: string): User {
  return {
    id: userId,
    lastActionTimestampMs: 0,
    heardFullGreeting: false,
    appState: AppState.MainMenu,
    coursesProgressMap: {
      thirtyDaysPhrasalVerbsChallenge: 0
    }
  };
}