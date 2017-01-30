/**
 * Set of debug options available for development purposes to speed up things like lessons listening or get additional
 * info about actions.
 */
export interface DebugOptions {
  useShortDebugLesson: boolean;
}

export function getDisabledDebugOptions(): DebugOptions {
  return {
    useShortDebugLesson: false
  };
}

export function getEnabledDebugOptions(): DebugOptions {
  return {
    useShortDebugLesson: true
  };
}