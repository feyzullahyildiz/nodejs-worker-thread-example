'use strict';
const { parentPort, threadId, isMainThread } = require('worker_threads');
const chalk = require('chalk');
log('worker: ', threadId);
log('isMainThread: ', isMainThread);
log('process.env.DB_HOST', process.env.DB_HOST);

parentPort.on('message', async (message) => {
    console.log('message', message);
    const { type, timeout } = message;
    await startProcess(timeout);

    log('killing myself: ', threadId);
    process.exit(0);
});
function startProcess(timeout) {
    return new Promise((res) => setTimeout(res, timeout))
}
function log(...items) {
    console.log(chalk.blue(`WORKER_${threadId}`), ...items)
}