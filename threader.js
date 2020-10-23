const { Worker } = require('worker_threads');
class Threader {
    NEXT_JOB_INDEX = 0;
    ACTIVE_THREAD_COUNT = 0;
    FINISHED_THREAD_COUNT = 0;
    INTERVAL_ID = null
    constructor(jobList, maxThreadSize, workerPath, verbose) {
        this.jobList = jobList;
        this.maxThreadSize = maxThreadSize;
        this.workerPath = workerPath;
        this.verbose = verbose;

        this.startPromise = new Promise((resolve) => {
            this.promiseResolveFunction = resolve;
        })
    }
    start = () => {

        for (let index = 0; index < this.maxThreadSize; index++) {
            this.checkQueueIsEmpty();
        }
        if (this.verbose) {
            this.INTERVAL_ID = setInterval(() => {
                this.logQueue();
            }, 200);
        }
        return this.startPromise;
    }
    startAThread = () => {
        const job = this.getNextJob()
        if (job === null) {
            return;
        }
        this.ACTIVE_THREAD_COUNT++;
        const w = this.createWorker(job);
        w.postMessage(job)
        w.on('exit', this.threadEnd);
    }
    threadEnd = () => {
        this.FINISHED_THREAD_COUNT++;
        this.ACTIVE_THREAD_COUNT--;
        this.checkQueueIsEmpty();
        this.checkAreJobsComplated();
    }
    checkAreJobsComplated = () => {
        if (this.ACTIVE_THREAD_COUNT === 0 && this.NEXT_JOB_INDEX === this.jobList.length) {
            this.logQueue();
            clearInterval(this.INTERVAL_ID);
            this.promiseResolveFunction();
        }
    }
    logQueue = () => {
        const str = [
            `${this.ACTIVE_THREAD_COUNT} / ${this.maxThreadSize}`,
            `nextJob: ${this.NEXT_JOB_INDEX}`,
            `threadEndCount: ${this.FINISHED_THREAD_COUNT}`,
        ].join('\n')
        console.clear();
        console.log(str.trim());
    }
    checkQueueIsEmpty = () => {
        if (this.ACTIVE_THREAD_COUNT < this.maxThreadSize) {
            if (this.jobList.length > 0) {
                this.startAThread()
            }
        }
    }

    getNextJob = () => {
        const job = this.jobList[this.NEXT_JOB_INDEX];
        if (!job) {
            return null;
        }
        this.NEXT_JOB_INDEX++;
        return job;
    }
    createWorker = () => {
        return new Worker(this.workerPath);
    }
}
module.exports = {
    Threader
}