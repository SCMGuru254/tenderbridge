
class PerformanceMonitor {
  private measurements: Map<string, number> = new Map();

  startMeasure(name: string): void {
    this.measurements.set(name, Date.now());
    console.log(`Started measuring: ${name}`);
  }

  endMeasure(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`No start time found for measurement: ${name}`);
      return 0;
    }
    
    const duration = Date.now() - startTime;
    this.measurements.delete(name);
    console.log(`Measurement ${name}: ${duration}ms`);
    return duration;
  }

  async measureAsyncTime<T>(fn: () => Promise<T>, name: string): Promise<T> {
    const start = Date.now();
    const result = await fn();
    const end = Date.now();
    
    const duration = end - start;
    console.log(`Async measurement ${name}: ${duration}ms`);
    return result;
  }

  mark(name: string): void {
    console.log(`Performance mark: ${name} at ${Date.now()}`);
  }
}

export const performanceMonitor = new PerformanceMonitor();
