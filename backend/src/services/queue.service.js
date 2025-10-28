const { Queue } = require('bullmq');

const connection = { host: process.env.REDIS_HOST || '127.0.0.1', port: 6379 };

// Create a new queue instance
const execQueue = new Queue('exec-jobs', { connection });

module.exports = { execQueue, connection };
