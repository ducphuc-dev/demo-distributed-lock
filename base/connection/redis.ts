import Redlock from 'redlock';
import Redis from 'ioredis'

const redisClient1 = new Redis({
    port: 6379,
    host: '0.0.0.0'
});

// const redisClient2 = new Redis({
//     port: 6379,
//     host: '103.56.158.112'
// });

// const redisClient3 = new Redis({
//     port: 6381,
//     host: '0.0.0.0'
// });

const redlock = new Redlock([redisClient1], {
  driftFactor: 0.01, // time drift factor, see https://redis.io/topics/distlock
  // retryCount: 10, // number of times to retry before giving up
  // retryDelay: 200, // time in ms between retries
  // retryJitter: 200, // jitter to apply to retry delay time
});

export const acquireLock = async (resource) => {
  try {
    const lock = await redlock.acquire(resource, 5000);
    console.log(`Lock acquired for ${resource}`);
    return lock;
  } catch (error) {
    console.log(error)
  }
}

export const releaseLock = async (lock) => {
  await redlock.release(lock);
  console.log(`Lock released for ${lock.resource}`);
}

export const watchResource = async (resource) => {
  await redisClient1.watch(resource)
}

export const unwatchResource = async () => {
  await redisClient1.unwatch()
}

export const getAsync = async (key) => {
  return redisClient1.get(key)
}

export const incrAsync = async (key, number) => {
  const result = await redisClient1.incrby(key, number)
  return result
}


