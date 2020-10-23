'use strict';
const { Worker, MessageChannel, MessagePort, isMainThread, parentPort } = require('worker_threads');
const path = require('path');
const chalk = require('chalk');
log('isMainThread: ', isMainThread);
const { Threader } = require('./threader');


// const maxThradSize = 50;
const jobs = Array.from({ length: 120 }).map((_, i) => {
    const timeout = Math.round(Math.random() * 2000) + 200;
    return { timeout }
    return { timeout: 1000 };
});
const threader = new Threader(jobs,
    20,
    path.resolve(__dirname, 'worker.js'),
    true
    );
threader.start().then(() => {
    console.log('finitto');
});

function log(...items) {
    console.log(chalk.yellow(`MAIN:`), ...items)
}