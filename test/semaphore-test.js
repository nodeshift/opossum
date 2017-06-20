'use strict';

const test = require('tape');
const Semaphore = require('../lib/semaphore');

test('Acquiring a semaphore reduces the number of locks available', t => {
  t.plan(2);
  const sem = Semaphore(1);
  t.equal(sem.count, 1, 'Semaphore should start with one lock available');
  sem.take();
  t.equal(sem.count, 0, 'Semaphore lock count reduced');
  t.end();
});

test('Releasing a semaphore increases the number of locks available', t => {
  t.plan(2);
  const sem = Semaphore(1);
  sem.take();
  t.equal(sem.count, 0, 'Semaphore lock count reduced');
  sem.release();
  t.equal(sem.count, 1, 'Semaphore lock count increased');
  t.end();
});

test('Semaphores wait until a lock is available', t => {
  t.plan(4);
  let waited = false;
  const sem = Semaphore(1);
  sem.take().then(_ => {
    t.equal(sem.count, 0, 'Semaphore lock count reduced');
    setTimeout(_ => {
      sem.release();
      waited = true;
    }, 500);
  });

  sem.take().then(_ => {
    t.equal(sem.count, 0, 'Semaphore lock count reduced');
    t.ok(waited, 'Semaphore waits to provide a lock');
    sem.release();
    t.equal(sem.count, 1, 'Semaphore lock count increased');
    t.end();
  });
});

// test('Semaphore promise resolution provides a lock ID', t => {
//   t.plan(3);
//   const sem = Semaphore(2);
//   sem.take()
//     .then(val => t.equal(val.id, 2))
//     .then(_ => {
//       sem.take().then(val => t.equal(val.id, 1));
//     })
//     .then(_ => {
//       t.equal(sem.count, 0, 'All locks acquired');
//       sem.release();
//       sem.release();
//       t.end();
//     });
// });

test('User code cannot change the lock count', t => {
  t.plan(3);
  const sem = Semaphore(1);
  t.equal(sem.count, 1, 'Semaphore starts with one lock');
  t.throws(_ => (sem.count = 4), TypeError, 'Semaphore throws TypeError when user code attempts to change count');
  t.equal(sem.count, 1, 'Semaphore count is read only to user code');
  t.end();
});

test('A semaphore can time out waiting for a lock', t => {
  t.plan(1);
  const sem = Semaphore(1);
  sem.take().then(_ => {
    sem.take(100).catch(e => {
      t.equals(e.code, 'ETIMEDOUT', 'Semaphore lock acquisition timed out');
      t.end();
    });
  });
});

test('A user can test semaphore to see if a lock is available', t => {
  t.plan(4);
  const sem = Semaphore(1);
  t.equal(sem.test(), true, 'test() returns true if a lock is available');
  t.equals(sem.count, 0, 'test() acquires an available lock');
  t.equal(sem.test(), false, 'test() returns false when a lock is unavailable');
  sem.release();
  t.equal(sem.test(), true, 'test() returns true when a lock is eventually released');
  t.end();
});
