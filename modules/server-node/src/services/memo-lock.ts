import crypto from "crypto";

import Redis from "ioredis";

const lockScript = `
  local len = redis.call("llen", KEYS[1]);
  if len >= tonumber(ARGV[2]) then
    return "QUEUE_FULL";
  end
  redis.call("rpush", KEYS[1], ARGV[1]);
  redis.call("hset", "memolock:resources", KEYS[1], "1");
  redis.call("set", KEYS[2], "1", "px", tonumber(ARGV[3]));
  if redis.call("lindex", KEYS[1], 0) == ARGV[1] then
    redis.call("publish", "memolock:acquire", KEYS[1] .. ARGV[1]); 
  end
  return "OK";
`;

const unlockScript = `
  local currVal = redis.call("lindex", KEYS[1], 0);
  if currVal == ARGV[1] then
    redis.call("lpop", KEYS[1]);
    local nextVal = redis.call("lindex", KEYS[1], 0);
    if nextVal then
      redis.call("publish", "memolock:acquire", KEYS[1] .. nextVal);
    else
      redis.call("hdel", "memolock:resources", KEYS[1]);
    end
    return "OK";    
  end
  return "NO_LOCK";
`;

const pulseScript = `
  for _,key in ipairs(redis.call("hkeys", "memolock:resources")) do
    local len = redis.call("llen", key);
    local deleted = 0;
    for j=1,len do
      local head = redis.call("lindex", key, 0);
      if redis.call("exists", key..head) == 1 then
        if j > 1 then
          redis.call("publish", "memolock:acquire", key..head);
        end
        break
      end
      redis.call("publish", "memolock:expire", key..redis.call("lpop", key));
      deleted = deleted + 1;
    end
    if deleted == len then
      redis.call("hdel", "memolock:resources", key);
    end
  end
`;

type Awaiter = {
  resolve: () => void;
  reject: (err: any) => void;
};

export class MemoLock {
  private awaiters: { [k: string]: Awaiter } = {};

  private pulseTimer: NodeJS.Timer | null = null;

  // subConn used for subscriber connections
  private subConn: Redis.Redis | undefined;

  constructor(
    private readonly redis: Redis.Redis,
    private readonly queueLen: number = 50,
    private readonly ttl: number = 30000,
    private readonly pulseInterval: number = 5000,
  ) {}

  async setupSubs(): Promise<void> {
    this.subConn = this.redis.duplicate();

    await new Promise((resolve, reject) =>
      this.subConn!.subscribe("memolock:acquire", (err: any) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }),
    );
    await new Promise((resolve, reject) =>
      this.subConn!.subscribe("memolock:expire", (err: any) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }),
    );

    this.subConn.on("message", (channel: any, message: string | number) => {
      const awaiter = this.awaiters[message];
      if (!awaiter) {
        return;
      }
      delete this.awaiters[message];
      switch (channel) {
        case "memolock:acquire":
          awaiter.resolve();
          break;
        case "memolock:expire":
          awaiter.reject(new Error(`Lock ${message} expired after ${this.ttl} seconds.`));
          break;
      }
    });

    this.redis.defineCommand("acquireMemolock", {
      numberOfKeys: 2,
      lua: lockScript,
    });
    this.redis.defineCommand("releaseMemolock", {
      numberOfKeys: 1,
      lua: unlockScript,
    });
    this.redis.defineCommand("pulseMemolock", {
      numberOfKeys: 0,
      lua: pulseScript,
    });

    this.pulseTimer = setInterval(() => {
      this.pulse().catch(e => {
        // this.log.error(`Error pulsing memolock: ${e.stack}`);
      });
    }, this.pulseInterval);
  }

  async pulse(): Promise<any> {
    return (this.redis as any).pulseMemolock();
  }

  async stopSubs(): Promise<any> {
    if (this.pulseTimer) {
      clearInterval(this.pulseTimer);
    }

    if (this.subConn) {
      this.subConn.disconnect();
    }
  }

  async acquireLock(lockName: string): Promise<string> {
    const value = this.randomValue();
    const awaiterKey = `${lockName}${value}`;
    return new Promise((resolve, reject) => {
      this.awaiters[awaiterKey] = {
        resolve: () => resolve(value),
        reject,
      };
      (this.redis as any).acquireMemolock(
        lockName,
        `${lockName}${value}`,
        value,
        this.queueLen,
        this.ttl,
        (err: any, res: string) => {
          if (res === "OK") {
            return;
          }
          delete this.awaiters[awaiterKey];
          if (err) {
            return reject(err);
          }
          if (res === "QUEUE_FULL") {
            return reject(new Error(`Queue is full.`));
          }
          return reject(new Error(`Unknown response ${res} during lock acquisition.`));
        },
      );
    });
  }

  async releaseLock(lockName: string, lockValue: string): Promise<void> {
    return new Promise((resolve, reject) => {
      (this.redis as any).releaseMemolock(lockName, lockValue, (err: any, res: string) => {
        if (err) {
          return reject(err);
        }
        if (res === "NO_LOCK") {
          return reject(new Error(`Can't release a lock that doesn't exist: ${lockName}`));
        }
        resolve();
      });
    });
  }

  private randomValue() {
    return crypto.randomBytes(16).toString("hex");
  }
}
