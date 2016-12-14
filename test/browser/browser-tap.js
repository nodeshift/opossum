// for browser output
// TODO: This is all pretty hackey
const log = console.log;
const inBrowser = typeof document !== 'undefined';

function enable () {
  console.log = function () {
    if (inBrowser) {
      printToBrowser(arguments[0]);
    }
    log.apply(log, Array.prototype.slice.call(arguments));
  };
}

function disable () {
  console.log = log;
}

function printToBrowser (line) {
  if (!line || line.length < 1) return;
  const p = document.body.appendChild(document.createElement('p'));
  const statusBar = document.getElementById('status-bar');
  if (line.startsWith('ok') || line.startsWith('# pass')) {
    p.style.color = 'green';
  } else if (line.startsWith('not ok') || line.startsWith('# fail')) {
    p.style.color = 'red';
    statusBar.style.backgroundColor = 'red';
  } else if (line.startsWith('# tests')) {
    p.className = 'test-count';
  } else if (line.startsWith('#')) {
    p.className = 'test-case';
  }
  p.innerHTML = line;
}

module.exports = exports = {
  enable, disable
};
