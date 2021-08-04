import redis from 'redis';
import dotenv from "dotenv";
dotenv.config();
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: 10549,
    password: process.env.REDIS_PWD
});

export default client;