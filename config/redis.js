const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Connected to Redis successfully'));

const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
    }
};

module.exports = {
    client,
    connectRedis
};
