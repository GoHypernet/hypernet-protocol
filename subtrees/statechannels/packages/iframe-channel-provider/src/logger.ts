/**
 * TODO: Explain how or why `process` is expected to exist.
 */

import pino from 'pino';
import _ from 'lodash';

// eslint-disable-next-line no-undef
const LOG_TO_CONSOLE = process.env.LOG_DESTINATION === 'console';
// eslint-disable-next-line no-undef
const LOG_TO_FILE = process.env.LOG_DESTINATION && !LOG_TO_CONSOLE;
// eslint-disable-next-line no-undef
const IS_BROWSER_CONTEXT = process.env.JEST_WORKER_ID === undefined;

const name = 'channel-provider';

const postMessageAndCallToConsoleFn = (consoleFn: {
  (message?: any, ...optionalParams: any[]): void;
}) => (o: any) => {
  const withName = JSON.stringify({...o, name});

  // The simplest way to give users/developers easy access to the logs in a single place is to
  // make the application aware of all the pino logs via postMessage
  // Then, the application can package up all the logs into a single file
  window.postMessage({type: 'PINO_LOG', logEvent: JSON.parse(withName)}, '*');
  if (LOG_TO_FILE) consoleFn(withName);
  else consoleFn(o.msg, _.omit(o, 'msg'));
};

const browser: any = IS_BROWSER_CONTEXT
  ? {
      write: {
        error: postMessageAndCallToConsoleFn(console.error),
        warn: postMessageAndCallToConsoleFn(console.warn),
        info: postMessageAndCallToConsoleFn(console.info),
        debug: postMessageAndCallToConsoleFn(console.debug),
        // Firefox & chrome automatically expand trace calls, which is pretty annoying.
        // So, we direct trace calls to console.debug instead.
        trace: postMessageAndCallToConsoleFn(console.debug)
      }
    }
  : undefined;

const prettyPrint = LOG_TO_CONSOLE ? {translateTime: true} : false;

const ADD_LOGS = LOG_TO_FILE || LOG_TO_CONSOLE;
// eslint-disable-next-line no-undef
const LOG_LEVEL = ADD_LOGS ? process.env.LOG_LEVEL ?? 'info' : 'silent';
const level = window.localStorage.LOG_LEVEL ?? LOG_LEVEL;

const opts = {name, prettyPrint, browser, level};
export const logger = pino(opts);

window.addEventListener('message', event => {
  if (event.data.type === 'SET_LOG_LEVEL') {
    const {level} = event.data;
    logger.level = level;
    console.log(`provider: level CLEARED from ${logger.level} to ${level}`);
  } else if (event.data.type === 'CLEAR_LOG_LEVEL') {
    logger.level = LOG_LEVEL;
    console.log(`provider: level CHANGED from ${logger.level} to ${LOG_LEVEL}`);
  }
});
