const counters = new Map<string, number>();
const latencies = new Map<string, number[]>();

export const metrics = {
  increment(name: string) {
    let currentCount = counters.get(name);

    if (currentCount === undefined) {
      currentCount = 0;
    }

    counters.set(name, currentCount + 1);
  },

  recordLatency(name: string, ms: number) {
    let timeList = latencies.get(name);

    if (timeList === undefined) {
      timeList = [];
    }

    timeList.push(ms);
    latencies.set(name, timeList);
  },

  avgLatency(name: string) {
    const timeList = latencies.get(name);

    if (timeList === undefined || timeList.length === 0) {
      return 0;
    }

    let total = 0;
    for (let i = 0; i < timeList.length; i++) {
      total = total + timeList[i];
    }

    return total / timeList.length;
  },

  toJSON() {
    const finalResult: Record<string, unknown> = {};

    for (const [key, value] of counters) {
      finalResult[`counter.${key}`] = value;
    }

    for (const [key] of latencies) {
      finalResult[`avg_ms.${key}`] = this.avgLatency(key);
    }

    return finalResult;
  },
};
