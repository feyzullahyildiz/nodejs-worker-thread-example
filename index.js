'use strict';
const { Worker, MessageChannel, MessagePort, isMainThread, parentPort } = require('worker_threads');
const path = require('path');
const chalk = require('chalk');
log('isMainThread: ', isMainThread);



const maxThradSize = 50;
const jobs = Array.from({ length: 120 }).map((_, i) => {
    const timeout = Math.round(Math.random() * 2000) + 200;
    return { timeout }
    return { timeout: 1000 };
});
let activeThreadCount = 0;
let NEXT_JOB_INDEX = 0;
function getNextJob() {
    const job = jobs[NEXT_JOB_INDEX];
    if (!job) {
        return null;
    }
    NEXT_JOB_INDEX++;
    return job;
}
const logIntervalId = setInterval(() => {
    logQueue();
}, 200);
function checkAreJobsComplated() {
    if (activeThreadCount === 0 && NEXT_JOB_INDEX === jobs.length) {
        logQueue();
        clearInterval(logIntervalId);
        log('complated');
    }
}
let threadEndCount = 0;
function threadEnd() {
    threadEndCount++;
    activeThreadCount--;
    checkQueueIsEmpty();
    checkAreJobsComplated();

}
function startAThread() {
    const job = getNextJob()
    if (job === null) {
        return;
    }
    activeThreadCount++;
    const w = createWorker(job);
    w.postMessage(job)
    w.on('exit', threadEnd);
}
function checkQueueIsEmpty() {
    if (activeThreadCount < maxThradSize) {
        if (jobs.length > 0) {
            startAThread()
        }
    }
}

for (let index = 0; index < maxThradSize; index++) {
    checkQueueIsEmpty();
}
function createWorker() {
    const filePath = path.resolve(__dirname, 'worker.js')
    return new Worker(filePath);
}
function logQueue() {
    const str = `
${activeThreadCount} / ${maxThradSize}
nextJob: ${NEXT_JOB_INDEX}
threadEndCount: ${threadEndCount}
`;
    console.clear();
    log(str.trim());
}
function log(...items) {
    console.log(chalk.yellow(`MAIN:`), ...items)
}