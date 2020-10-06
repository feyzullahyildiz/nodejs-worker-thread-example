'use strict';
const { Worker, MessageChannel, MessagePort, isMainThread, parentPort } = require('worker_threads');
const path = require('path');
const chalk = require('chalk');
log('isMainThread: ', isMainThread);

process.env.DB_HOST = '127.0.0.1';

const workerExit = function (code) {
    log(chalk.redBright('worker exited code: ' + code));
}
const w1 = createWorker();

w1.on('exit', workerExit)
w1.postMessage({
    type: 'start',
    timeout: 1000
});
const w2 = createWorker();
w2.on('exit', workerExit)
w2.postMessage({
    type: 'start',
    timeout: 2000
});


function createWorker() {
    log('createWorker')
    const filePath = path.resolve(__dirname, 'worker.js')
    return new Worker(filePath);
}
function log(...items) {
    console.log(chalk.yellow(`MAIN:`), ...items)
}