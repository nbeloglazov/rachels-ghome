import * as actions from '../actions';
import {AppState} from '../user';
import {THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE, getLessonLink} from '../lessons';

function handleUserReachedEndOfCourse(request: actions.ActionRequest): actions.ActionResponse {
  const user = request.user;
  user.appState = AppState.MainMenu;
  return {
    user: user,
    responseType: actions.ResponseType.Ask,
    responseMessage: '<speak>You already finished thirty days phrasal verb challenge! ' +
    'You can listen to random lessons by saying "play random lesson"</speak>'
  };
}


function handleUserHasMoreLessons(request: actions.ActionRequest): actions.ActionResponse {
  const user = request.user;
  user.appState = AppState.AwatingLessonCompleteConfirmation;
  const currentLesson = THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE[user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge];
  const lessonLink = getLessonLink(currentLesson, user);
  return {
    user: user,
    responseType: actions.ResponseType.Ask,
    responseMessage: `
       <speak>Playing lesson "${currentLesson.name}". 
       <audio src="${lessonLink}">${currentLesson.name}</audio>
       You've completed "${currentLesson.name}" lesson. Say "yes" to mark this lesson as completed.</speak>`
  };
}

function handleUserCompletedLesson(request: actions.ActionRequest): actions.ActionResponse {
  const user = request.user;
  user.appState = AppState.MainMenu;
  user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge++;
  return {
    user: user,
    responseType: actions.ResponseType.Ask,
    responseMessage: '<speak>Lesson marked as completed. What do you want to do next?</speak>'
  };
}

function isUserLessonDoneResponse(request: actions.ActionRequest): boolean {
  const input = request.requestMessage.toLowerCase();
  return (input.includes('done') || input.includes('yes') || input.includes('completed')) &&
      request.user.appState === AppState.AwatingLessonCompleteConfirmation;
}

/**
 * This handler is called when user asks to play next lesson.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage.toLowerCase().includes('next lesson') ||
        isUserLessonDoneResponse(request);
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    if (isUserLessonDoneResponse(request)) {
      return handleUserCompletedLesson(request);
    } else if (request.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge ===
        THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE.length) {
      return handleUserReachedEndOfCourse(request);
    } else {
      return handleUserHasMoreLessons(request);
    }
  },

  getType() { return actions.ActionType.PlayNextLesson; }
};
