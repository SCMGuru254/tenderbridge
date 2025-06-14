
interface Timer {
  startTime: number;
  name: string;
}

interface MetricPoint {
  timestamp: number;
  value: number;
  labels?: Record<string, string>;
}

interface PerformanceMetrics {
  timers: Map<string, Timer>;
  measurements: Map<string, MetricPoint[]>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private readonly MAX_HISTORY = 1000;

  private constructor() {
    this.metrics = {
      timers: new Map(),
      measurements: new Map()
    };
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): void {
    this.metrics.timers.set(name, {
      startTime: performance.now(),
      name
    });
  }

  endTimer(name: string): number {
    const timer = this.metrics.timers.get(name);
    if (!timer) {
      console.warn(`No timer found with name: ${name}`);
      return 0;
    }

    const duration = performance.now() - timer.startTime;
    this.recordMetric(name, duration);
    this.metrics.timers.delete(name);
    return duration;
  }

  // Aliases for backward compatibility
  startMeasure(name: string): void {
    this.startTimer(name);
  }

  endMeasure(name: string): number {
    return this.endTimer(name);
  }

  private recordMetric(name: string, value: number, labels?: Record<string, string>): void {
    if (!this.metrics.measurements.has(name)) {
      this.metrics.measurements.set(name, []);
    }

    const measurements = this.metrics.measurements.get(name)!;
    measurements.push({
      timestamp: Date.now(),
      value,
      labels
    });

    // Trim old measurements if exceeding MAX_HISTORY
    if (measurements.length > this.MAX_HISTORY) {
      measurements.splice(0, measurements.length - this.MAX_HISTORY);
    }
  }

  getMetrics(name?: string): Record<string, MetricPoint[]> {
    if (name) {
      const metrics = this.metrics.measurements.get(name);
      return metrics ? { [name]: metrics } : {};
    }

    const result: Record<string, MetricPoint[]> = {};
    this.metrics.measurements.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  clearMetrics(name?: string): void {
    if (name) {
      this.metrics.measurements.delete(name);
      return;
    }
    this.metrics.measurements.clear();
  }

  getActiveTimers(): string[] {
    return Array.from(this.metrics.timers.keys());
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
