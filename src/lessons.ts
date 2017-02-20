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
    name: `Day 1. Phrasal verb "crack".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day1_crack`,
    numberOfParts: 3
  },
  {
    name: `Day 2. Phrasal verb "bang".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day2_bang`,
    numberOfParts: 2
  },
  {
    name: `Day 3. Phrasal verb "cut". Part 1.`,
    audioLink: `phrasalverbs30daychallenge/cut/Day3_cut1`,
    numberOfParts: 3
  },
  {
    name: `Day 4. Phrasal verb "cut". Part 2.`,
    audioLink: `phrasalverbs30daychallenge/cut/Day4_cut2`,
    numberOfParts: 3
  },
  {
    name: `Day 5. Phrasal verb "pin".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day5_pin`,
    numberOfParts: 2
  },
  {
    name: `Day 6. Phrasal verb "Tell".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day6_Tell`,
    numberOfParts: 2
  },
  {
    name: `Day 7. Phrasal verb "play".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day7_play`,
    numberOfParts: 2
  },
  {
    name: `Day 8. Phrasal verb "hit".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day8_hit`,
    numberOfParts: 1
  },
  {
    name: `Day 9. Phrasal verb "hear".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day9_hear`,
    numberOfParts: 2
  },
  {
    name: `Day 10. Phrasal verb "price".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day10_price`,
    numberOfParts: 2
  },
  {
    name: `Day 11. Phrasal verb "die".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day11_die`,
    numberOfParts: 2
  },
  {
    name: `Day 12. Phrasal verb "break". Part 1.`,
    audioLink: `phrasalverbs30daychallenge/cut/Day12_break_1`,
    numberOfParts: 3
  },
  {
    name: `Day 13. Phrasal verb "break". Part 2.`,
    audioLink: `phrasalverbs30daychallenge/cut/Day13_break_2`,
    numberOfParts: 2
  },
  {
    name: `Day 14. Phrasal verb "psych".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day14_psych`,
    numberOfParts: 1
  },
  {
    name: `Day 15. Phrasal verb "tap".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day15_tap`,
    numberOfParts: 1
  },
  {
    name: `Day 16. Phrasal verb "head".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day16_head`,
    numberOfParts: 2
  },
  {
    name: `Day 17. Phrasal verb "snap".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day17_snap`,
    numberOfParts: 1
  },
  {
    name: `Day 18. Phrasal verb "show".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day18_show`,
    numberOfParts: 1
  },
  {
    name: `Day 19. Phrasal verb "walk".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day19_walk`,
    numberOfParts: 2
  },
  {
    name: `Day 20. Phrasal verb "grind".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day20_grind`,
    numberOfParts: 2
  },
  {
    name: `Day 21. Phrasal verb "buy".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day21_buy`,
    numberOfParts: 2
  },
  {
    name: `Day 22. Phrasal verb "polish".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day22_polish`,
    numberOfParts: 2
  },
  {
    name: `Day 23. Phrasal verb "sleep".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day23_sleep`,
    numberOfParts: 2
  },
  {
    name: `Day 24. Phrasal verb "grow".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day24_grow`,
    numberOfParts: 2
  },
  {
    name: `Day 25. Phrasal verb "dig".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day25_dig`,
    numberOfParts: 1
  },
  {
    name: `Day 26. Phrasal verb "work". Part 1.`,
    audioLink: `phrasalverbs30daychallenge/cut/Day26_work_1`,
    numberOfParts: 2
  },
  {
    name: `Day 27. Phrasal verb "work". Part 2.`,
    audioLink: `phrasalverbs30daychallenge/cut/Day27_work_2`,
    numberOfParts: 3
  },
  {
    name: `Day 28. Phrasal verb "cry".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day28_cry`,
    numberOfParts: 2
  },
  {
    name: `Day 29. Phrasal verb "write".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day29_write`,
    numberOfParts: 3
  },
  {
    name: `Day 30. Phrasal verb "sign".`,
    audioLink: `phrasalverbs30daychallenge/cut/Day30_sign`,
    numberOfParts: 2
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
    audioLink: 'https://storage.googleapis.com/rachels-ghome.appspot.com/rachelsenglish/American%20English%20-%20EE%20%5Bi%5D%20Vowel%20-%20How%20to%20make%20the%20EE%20Vowel.mp3',
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
    return AUDIO_URL_PREFIX + lesson.audioLink + '-0' + (part + 1) + '.mp3';
  }
}

export function getCourse(user: User): Course {
  if (user.debugOptions.useCourseForAutomatedTests) {
    return COURSE_FOR_AUTOMATED_TESTS;
  } else {
    return THIRTY_DAYS_PHRASAL_VERBS_CHALLENGE;
  }
}