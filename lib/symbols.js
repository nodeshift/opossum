'use strict';

const STATE = Symbol('state');
const OPEN = Symbol('open');
const CLOSED = Symbol('closed');
const HALF_OPEN = Symbol('half-open');
const PENDING_CLOSE = Symbol('pending-close');
const FALLBACK_FUNCTION = Symbol('fallback');
const STATUS = Symbol('status');
const NAME = Symbol('name');
const GROUP = Symbol('group');
const HYSTRIX_STATS = Symbol('hystrix-stats');
const ENABLED = Symbol('Enabled');

module.exports = exports = {
  STATE,
  OPEN,
  CLOSED,
  HALF_OPEN,
  PENDING_CLOSE,
  FALLBACK_FUNCTION,
  STATUS,
  NAME,
  GROUP,
  HYSTRIX_STATS,
  ENABLED
};
