import * as actions from '../actions';
import {getCourse, getLessonLink} from '../lessons';
import {User, AppState} from '../user';


export function getRandomLessonIndex(user: User): number {
  const course = getCourse(user);
  return user.debugOptions.randomNumber === undefined ?
      Math.floor(Math.random() * course.length) : user.debugOptions.randomNumber;
}

function userRequestedLessonPartContinue(request: actions.ActionRequest): boolean {
  const input = request.requestMessage.toLowerCase();
  return (input.includes('done') || input.includes('yes') || input.includes('completed')) &&
      request.user.appState === AppState.AwaitingRandomLessonCompleteConfirmation;
}

/**
 * This handler is called when user asks to play next lesson.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage.toLowerCase().includes('random lesson') || userRequestedLessonPartContinue(request)
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    const user = request.user;
    const playingNewLesson = !userRequestedLessonPartContinue(request);
    if (playingNewLesson) {
      user.currentRandomLesson = getRandomLessonIndex(user);
      user.currentLessonPart = 0;
    } else {
      user.currentLessonPart++;
    }
    const lesson = getCourse(user)[user.currentRandomLesson];
    const lessonLink = getLessonLink(lesson, user.currentLessonPart, user);
    const openingMessage = playingNewLesson ? `Playing lesson "${lesson.name}".` : ``;
    const audioFile = `<audio src="${lessonLink}">${lesson.name}</audio><break time="1s"/>`;
    const playingLastPart = user.currentLessonPart + 1 === lesson.numberOfParts;
    const callToAction = `Say "yes" to continue.`;
    const finishingMessage = playingLastPart ?
        `You have completed lesson "${lesson.name}"<break time="0.2s"/>. Say 'play random lesson' to do another lesson
         or you may say 'quit'.` :
        `End of part <say-as interpret-as="cardinal">${user.currentLessonPart+1}</say-as>. ${callToAction}`;
    user.appState = playingLastPart ? AppState.MainMenu : AppState.AwaitingRandomLessonCompleteConfirmation;
    const response: actions.ActionResponse = {
      user: user,
      responseType: actions.ResponseType.Ask,
      responseMessage: `<speak>${openingMessage} ${audioFile} ${finishingMessage}</speak>`,
    };
    if (!playingLastPart) {
      response.noInputsMessage = [callToAction];
    }
    return response;
  },

  getType() { return actions.ActionType.PlayRandomLesson; }
};
