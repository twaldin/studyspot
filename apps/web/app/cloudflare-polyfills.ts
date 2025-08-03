// Cloudflare Workers polyfills for Next.js compatibility

// WeakRef polyfill for Cloudflare Workers
if (typeof globalThis !== 'undefined' && !globalThis.WeakRef) {
  // Simple WeakRef polyfill - just wraps the object
  // This won't provide actual weak reference behavior but prevents errors
  (globalThis as any).WeakRef = class WeakRef<T extends object> {
    private target: T | undefined;
    
    constructor(target: T) {
      this.target = target;
    }
    
    deref(): T | undefined {
      return this.target;
    }
  };
}

// FinalizationRegistry polyfill (often used with WeakRef)
if (typeof globalThis !== 'undefined' && !globalThis.FinalizationRegistry) {
  (globalThis as any).FinalizationRegistry = class FinalizationRegistry {
    constructor(cleanupCallback: any) {
      // No-op implementation
    }
    
    register(target: any, heldValue: any, unregisterToken?: any): void {
      // No-op
    }
    
    unregister(unregisterToken: any): void {
      // No-op
    }
  };
}

export {};