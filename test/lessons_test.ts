import * as https from 'https';
import {Lesson, getLessonLink, getCourse} from '../src/lessons';
import {User, getDefaultUser} from '../src/user';

function checkLinkReturnsValidMp3(link: string): Promise<undefined> {
  return new Promise<undefined>((resolve, reject) => {
    https.get(link, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Got response ${res.statusCode} for link ${link}`));
        return;
      }
      const contentType = res.headers['content-type'];
      if (contentType !== 'audio/mp3') {
        reject(new Error(`File ${link} is not mp3.`));
      }
      resolve();
    })
  });
}

function checkLessonIsValid(lesson: Lesson, user: User): Promise<undefined[]> {
  const partsAreValid: Array<Promise<undefined>> = [];
  for (let i = 0; i < lesson.numberOfParts; i++) {
    const link = getLessonLink(lesson, i, user);
    partsAreValid.push(checkLinkReturnsValidMp3(link));
  }
  return Promise.all(partsAreValid);
}

describe('lessons', function() {
  it('should return 200 for all audio file links', function() {
    // Setting up database might take time, for example waiting for
    // database to become available so increase timeout.
    this.timeout(10000);
    const user = getDefaultUser('123');
    const promises = [];
    for (const lesson of getCourse(user)) {
      promises.push(checkLessonIsValid(lesson, user));
    }
    return Promise.all(promises);
  });
});
