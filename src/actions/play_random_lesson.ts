import * as actions from '../actions';
import {THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE, Lesson, getLessonLink} from '../lessons';


export function getRandomLesson(): Lesson {
  const lessonNum = Math.floor(Math.random() * THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE.length);
  return THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE[lessonNum];
}

/**
 * This handler is called when user asks to play next lesson.
 */
export const HANDLER: actions.ActionHandler = {
  canHandle(request: actions.ActionRequest): boolean {
    return request.requestMessage.toLowerCase().includes('random lesson');
  },

  handle(request: actions.ActionRequest): actions.ActionResponse {
    const user = request.user;
    const randomLesson = getRandomLesson();
    const lessonLink = getLessonLink(randomLesson, user);
    return {
      user: user,
      responseType: actions.ResponseType.Ask,
      responseMessage: `
       <speak>Playing lesson "${randomLesson.name}". 
       <audio src="${lessonLink}">${randomLesson.name}</audio>
       You've completed "${randomLesson.name}" lesson. Say 'play random lesson' to do another lesson
       or you may say 'quit'.</speak>`
    };
  },

  getType() { return actions.ActionType.PlayRandomLesson; }
};
