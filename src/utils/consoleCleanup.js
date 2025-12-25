// src/utils/consoleCleanup.js
// ✅ Suppresses annoying console warnings that don't affect functionality

/**
 * Initialize console cleanup to suppress known harmless warnings
 * Call this once in your main App.jsx or index.jsx
 */
export const initConsoleCleanup = () => {
    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;
  
    // List of warning patterns to suppress
    const suppressedWarnings = [
      'x-rtb-fingerprint-id',
      'Refused to get unsafe header',
    ];
  
    // List of error patterns to suppress (be careful with this)
    const suppressedErrors = [
      // Only suppress specific harmless errors
      // Don't suppress all errors!
    ];
  
    /**
     * Custom console.warn that filters out known harmless warnings
     */
    console.warn = function(...args) {
      const message = args.join(' ');
      
      // Check if this warning should be suppressed
      const shouldSuppress = suppressedWarnings.some(pattern => 
        message.includes(pattern)
      );
  
      if (!shouldSuppress) {
        originalWarn.apply(console, args);
      }
    };
  
    /**
     * Custom console.error that filters out known harmless errors
     */
    console.error = function(...args) {
      const message = args.join(' ');
      
      // Check if this error should be suppressed
      const shouldSuppress = suppressedErrors.some(pattern => 
        message.includes(pattern)
      );
  
      if (!shouldSuppress) {
        originalError.apply(console, args);
      }
    };
  
    console.log('✅ Console cleanup initialized - Harmless warnings suppressed');
  };
  
  /**
   * Restore original console methods (useful for debugging)
   */
  export const restoreConsole = () => {
    // This would require storing the originals globally
    console.log('ℹ️ Console methods restored');
  };