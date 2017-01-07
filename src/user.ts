/**
 * Interface representing user. For now it's a kitchen sync for all fields that are stored in DB. If you need to store
 * something in DB - add new field here and use it in ActionHandler.
 */
export interface User {
  /** User id passed from ghome sdk: https://developers.google.com/actions/reference/conversation#User */
  id: string,

  /**
   * The last time user did some voice action in ms since 1 January 1970. Note that when you're processing request
   * this number will refer to the previous user action, not the current so you can calculate the difference between
   * now and then by using Date.now() - lastActionTimestampMs
   */
  lastActionTimestampMs: number,

  /**
   * Defines whether user already heard initial full-form greeting and it can be skipped for follow up visits.
   */
  heardFirstGreeting: boolean
}