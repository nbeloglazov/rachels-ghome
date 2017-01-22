import * as actions from '../actions';
import {AppState} from '../user';
import {THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE} from '../lessons';

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
  user.appState = AppState.MainMenu;
  const currentLesson = THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE[user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge];
  user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge++;
  return {
    user: user,
    responseType: actions.ResponseType.Ask,
    responseMessage: `
       <speak>Playing lesson "${currentLesson.name}". 
       <audio src="${currentLesson.audioLink}">${currentLesson.name}</audio>
       You've completed "${currentLesson.name}" lesson. Say 'play next lesson' to do another lesson
       or say 'cancel' to quit.</speak>`
  };
}

/**
 * This handler is called when user asks to play next lesson.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage.toLowerCase().includes('next lesson');
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    if (request.user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge ===
        THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE.length) {
      return handleUserReachedEndOfCourse(request);
    } else {
      return handleUserHasMoreLessons(request);
    }
  },

  getType() { return actions.ActionType.PlayNextLesson; }
};
