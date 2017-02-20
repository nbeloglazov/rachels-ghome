import * as actions from '../actions';
import {AppState, User} from '../user';
import {getCourse} from '../lessons';

function userIsInTheMiddleOfMultipartLesson(user: User): boolean {
  if (user.appState === AppState.AwaitingRandomLessonCompleteConfirmation) {
    const lesson = getCourse(user)[user.currentRandomLesson];
    return lesson.numberOfParts > user.currentLessonPart + 1;
  } else if (user.appState === AppState.AwaitingNextLessonCompleteConfirmation) {
    const lesson = getCourse(user)[user.coursesProgressMap.thirtyDaysPhrasalVerbsChallenge];
    return lesson.numberOfParts > user.currentLessonPart + 1;
  } else {
    return false;
  }
}

/**
 * This handler is called when no other handler can handle user requests. We assume at this point that we either
 * didn't understand or cannot handle user command.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(_: actions.ActionRequest): boolean {
    return true;
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    const sayYesTo = `Say "yes" to `;
    let message = 'Sorry, I didn\'t understand that. ';
    let callToAction = null;
    if (userIsInTheMiddleOfMultipartLesson(request.user)) {
      callToAction = sayYesTo + `continue the lesson.`;
      message += callToAction;
    } else if (request.user.appState === AppState.AwaitingNextLessonCompleteConfirmation) {
      callToAction = sayYesTo + `complete the lesson.`;
      message += callToAction;
    } else {
      message += `Say "help" to hear a list of possible commands.`;
    }

    const response: actions.ActionResponse = {
      user: request.user,
      responseType: actions.ResponseType.Ask,
      responseMessage: '<speak>' + message + '</speak>'
    };
    if (callToAction) {
      response.noInputsMessage = [callToAction];
    }
    return response;
  },

  getType() { return actions.ActionType.DontUnderstand; }
};
