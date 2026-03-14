export interface MetricsSnapshot {
  totalRequests: number;
  errors: number;
}

export class MetricsCollector {
  private totalRequests = 0;
  private errors = 0;

  recordRequest(method: string, route: string, duration: number): void {
    this.totalRequests++;
  }

  recordError(error: Error): void {
    this.errors++;
  }

  getMetrics(): MetricsSnapshot {
    return { totalRequests: this.totalRequests, errors: this.errors };
  }
}
