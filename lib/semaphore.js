'use strict';

const kSemaphoreCounter = Symbol('kSemaphoreCounter');
const kSemaphoreResolvers = Symbol('kSemaphoreResolvers');

class Semaphore {
  constructor (count) {
    this[kSemaphoreCounter] = count;
    this[kSemaphoreResolvers] = [];
  }

  get count () {
    return this[kSemaphoreCounter];
  }

  take () {
    if (this[kSemaphoreCounter] > 0) {
      --this[kSemaphoreCounter];

      return Promise.resolve(this.release.bind(this));
    }

    return new Promise(resolve => {
      this[kSemaphoreResolvers].push(_ => {
        --this[kSemaphoreCounter];
        resolve(this.release.bind(this));
      });
    });
  }

  release () {
    this[kSemaphoreCounter]++;

    if (this[kSemaphoreResolvers].length > 0) {
      this[kSemaphoreResolvers].shift()();
    }
  }

  test () {
    if (this[kSemaphoreCounter] < 1) {
      return false;
    }

    --this[kSemaphoreCounter];

    return true;
  }
}

function SemaphoreCtor (count) {
  return new Semaphore(count);
}

module.exports = exports = SemaphoreCtor;
