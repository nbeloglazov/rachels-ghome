import {User} from './user';
export interface Lesson {
  name: string;
  audioLink: string;
  numberOfParts: number;
}

export type Course = Array<Lesson>;

const AUDIO_URL_PREFIX = 'https://storage.googleapis.com/rachels-ghome.appspot.com/';

const THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE: Course = [
  {
    name: 'Day 1. Phrasal verb "crack".',
    audioLink:   'phrasalverbs30daychallenge/cut/Day1_crack',
    numberOfParts: 3,
  },
  {
    name: 'Day 2. Phrasal verb "bang".',
    audioLink:   'phrasalverbs30daychallenge/cut/Day2_bang',
    numberOfParts: 2,
  },
];

const COURSE_FOR_AUTOMATED_TESTS: Course = [
  {
    name: 'Lesson 1.',
    audioLink: 'tests/lesson1',
    numberOfParts: 1,
  },
  {
    name: 'Lesson 2.',
    audioLink: 'tests/lesson2',
    numberOfParts: 3,
  },
  {
    name: 'Lesson 3.',
    audioLink: 'tests/lesson3',
    numberOfParts: 1,
  },
];

export const RANDOM_TEST_LESSONS: Array<Lesson> = [
  {
    name: 'How to make the EE vowel',
    audioLink:   'https://storage.googleapis.com/rachels-ghome.appspot.com/rachelsenglish/American%20English%20-%20EE%20%5Bi%5D%20Vowel%20-%20How%20to%20make%20the%20EE%20Vowel.mp3',
    numberOfParts: 1,
  },
  {
    name: 'How to make the IH vowel',
    audioLink: 'https://storage.googleapis.com/rachels-ghome.appspot.com/rachelsenglish/American%20English%20-%20IH%20%5B%C9%AA%5D%20Vowel%20-%20How%20to%20make%20the%20IH%20Vowel.mp3',
    numberOfParts: 1,
  },
  {
    name: 'Comprehension Test',
    audioLink: 'https://storage.googleapis.com/rachels-ghome.appspot.com/rachelsenglish/Comprehension%20test%20%20IH%20vowel%20American%20English%20Pronunciation.mp3',
    numberOfParts: 1,
  },
  {
    name: 'EE versus IH',
    audioLink: 'https://storage.googleapis.com/rachels-ghome.appspot.com/rachelsenglish/EE%20vs.%20IH%2C%20Long%20and%20Short%20Vowels%20-%20American%20English.mp3',
    numberOfParts: 1,
  },
  {
    name: 'How to pronounce AY diphthong',
    audioLink: 'https://storage.googleapis.com/rachels-ghome.appspot.com/rachelsenglish/English%20How%20to%20Pronounce%20AY%20%5Be%C9%AA%5D%20diphthong%20American%20Accent.mp3',
    numberOfParts: 1,
  },
  {
    name: 'How to pronounce EE versus IH',
    audioLink: 'https://storage.googleapis.com/rachels-ghome.appspot.com/rachelsenglish/How%20to%20Pronounce%20EE%20vs.%20IH%2C%20leave%20vs.%20live%20--%20American%20English.mp3',
    numberOfParts: 1,
  },
  {
    name: 'How to pronounce the I in ING',
    audioLink: 'https://storage.googleapis.com/rachels-ghome.appspot.com/rachelsenglish/How%20to%20Pronounce%20the%20I%20in%20ING%20American%20English.mp3',
    numberOfParts: 1,
  }
];

const DEBUG_LESSON = 'https://storage.googleapis.com/rachels-ghome.appspot.com/debug_lesson.mp3';

export function getLessonLink(lesson: Lesson, part: number, user: User): string {
  if (part < 0 || part >= lesson.numberOfParts) {
    throw new Error(`cannot get part ${part} for lesson that has ${lesson.numberOfParts} parts`);
  }
  if (user.debugOptions.useShortDebugLesson) {
    return DEBUG_LESSON;
  } else {
    return AUDIO_URL_PREFIX + lesson.audioLink + '_' + (part + 1) + '.mp3';
  }
}

export function getCourse(user: User): Course {
  if (user.debugOptions.useCourseForAutomatedTests) {
    return COURSE_FOR_AUTOMATED_TESTS;
  } else {
    return THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE;
  }
}