import * as actions from '../actions';
import {AppState, User} from '../user';
import {getCourse, getLessonLink, Lesson} from '../lessons';

function getCurrentLesson(user: User): Lesson {
  return getCourse(user)[user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge];
}

function handleUserReachedEndOfCourse(request: actions.ActionRequest): actions.ActionResponse {
  const user = request.user;
  user.appState = AppState.MainMenu;
  return {
    user: user,
    responseType: actions.ResponseType.Ask,
    responseMessage: `<speak>You've already finished thirty days phrasal verb challenge! 
    You can listen to random lessons by saying "play random lesson"</speak>`
  };
}


function handleUserHasMoreLessons(request: actions.ActionRequest): actions.ActionResponse {
  const user = request.user;
  user.appState = AppState.AwaitingNextLessonCompleteConfirmation;
  const currentLesson = getCurrentLesson(user);
  const lessonLink = getLessonLink(currentLesson, user.currentLessonPart, user);
  const openingPhrase = user.currentLessonPart === 0 ? `Playing lesson "${currentLesson.name}".` : ``;
  const audioFile = `<audio src="${lessonLink}">${currentLesson.name}</audio><break time="1s"/>`;
  const isPlayingLastPart = user.currentLessonPart === currentLesson.numberOfParts - 1;
  const callToAction = isPlayingLastPart ? `Say "yes" to complete this lesson.` : `Say "yes" to continue.`;
  const finishPhrase = (isPlayingLastPart ?
      `You have completed lesson "${currentLesson.name}"  <break time="0.2s"/>.` :
      `End of part <say-as interpret-as="cardinal">${user.currentLessonPart+1}</say-as>.`) + callToAction;

  return {
    user: user,
    responseType: actions.ResponseType.Ask,
    responseMessage: `<speak>${openingPhrase} ${audioFile} ${finishPhrase}</speak>`,
    noInputsMessage: [callToAction],
  };
}

function handleUserCompletedLesson(request: actions.ActionRequest): actions.ActionResponse {
  const user = request.user;
  user.currentLessonPart++;
  const currentLesson = getCurrentLesson(user);
  if (user.currentLessonPart < currentLesson.numberOfParts) {
    // User in a middle of multi-part lesson.
    return handleUserHasMoreLessons(request);
  } else {
    // User finished all parts of the lesson.
    user.appState = AppState.MainMenu;
    user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge++;
    user.currentLessonPart = 0;
    return {
      user: user,
      responseType: actions.ResponseType.Ask,
      responseMessage: `<speak>Lesson marked as completed. What do you want to do next?</speak>`,
    };
  }
}

function isUserLessonDoneResponse(request: actions.ActionRequest): boolean {
  const input = request.requestMessage.toLowerCase();
  return (input.includes('done') || input.includes('yes') || input.includes('completed')) &&
      request.user.appState === AppState.AwaitingNextLessonCompleteConfirmation;
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
        getCourse(request.user).length) {
      return handleUserReachedEndOfCourse(request);
    } else {
      request.user.currentLessonPart = 0;
      return handleUserHasMoreLessons(request);
    }
  },

  getType() { return actions.ActionType.PlayNextLesson; }
};
