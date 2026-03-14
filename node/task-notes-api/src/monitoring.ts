export interface HealthStatus {
  status: string;
  uptime: number;
}
export interface ServiceStatus {
  name: string;
  status: "up" | "down";
}

export class HealthChecker {
  async checkHealth(): Promise<HealthStatus> {
    return { status: "ok", uptime: process.uptime() };
  }
  async checkDependencies(): Promise<ServiceStatus[]> {
    return [{ name: "sqlite", status: "up" }]; // Mocked for now
  }
}
