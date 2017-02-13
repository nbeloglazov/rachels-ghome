/**
 * Set of debug options available for development purposes to speed up things like lessons listening or get additional
 * info about actions.
 */
export interface DebugOptions {
  useShortDebugLesson: boolean;
  useCourseForAutomatedTests: boolean;
  // Number to be used in getRandomLessonIndex and other stuff. It's a hack and should be replaced with proper random
  // generator mock in future.
  // https://xkcd.com/221/
  randomNumber?: number;
}

export function getDisabledDebugOptions(): DebugOptions {
  return {
    useShortDebugLesson: false,
    useCourseForAutomatedTests: false,
  };
}

export function getEnabledDebugOptions(): DebugOptions {
  return {
    useShortDebugLesson: true,
    useCourseForAutomatedTests: false,
  };
}