
/**
 * A simple EventEmitter implementation for browser environments
 */
export class BrowserEventEmitter {
  private events: Record<string, Array<(data?: any) => void>> = {};

  on(event: string, listener: (data?: any) => void): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, data?: any): void {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(data));
    }
  }

  removeListener(event: string, listener: (data?: any) => void): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }
}
