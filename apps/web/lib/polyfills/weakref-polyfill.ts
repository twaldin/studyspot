// WeakRef polyfill for older environments
declare global {
  interface Window {
    WeakRef?: typeof WeakRef;
    FinalizationRegistry?: typeof FinalizationRegistry;
  }
}

// Only polyfill if not available
if (typeof globalThis !== 'undefined' && typeof globalThis.WeakRef === 'undefined') {
  (globalThis as any).WeakRef = class WeakRef<T extends object> {
    private _target: T | undefined;
    
    constructor(target: T) {
      this._target = target;
    }
    
    deref(): T | undefined {
      return this._target;
    }
  };
}

// Also polyfill FinalizationRegistry if needed
if (typeof globalThis !== 'undefined' && typeof globalThis.FinalizationRegistry === 'undefined') {
  (globalThis as any).FinalizationRegistry = class FinalizationRegistry {
    constructor(cleanupCallback: (heldValue: any) => void) {
      // No-op implementation for compatibility
    }
    
    register(target: object, heldValue: any, unregisterToken?: object): void {
      // No-op
    }
    
    unregister(unregisterToken: object): boolean {
      return false;
    }
  };
}

export {};