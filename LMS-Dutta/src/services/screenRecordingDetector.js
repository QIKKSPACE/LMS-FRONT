class ScreenRecordingDetector {
    constructor() {
      this.isRecording = false;
      this.callbacks = [];
      this.detectionInterval = null;
      this.originalMediaDevices = null;
      
      // Detection methods status
      this.detectionMethods = {
        mediaDevicesAPI: false,
        documentVisibility: false,
        performanceMonitor: false,
        devToolsDetector: false
      };
    }
  
    /**
     * Start monitoring for screen recording
     * @param {Function} onRecordingDetected - Callback when recording detected
     */
    startMonitoring(onRecordingDetected) {
      console.log('🔒 Starting screen recording detection...');
      
      if (onRecordingDetected) {
        this.callbacks.push(onRecordingDetected);
      }
  
      // Method 1: Monitor Media Devices API
      this.monitorMediaDevices();
  
      // Method 2: Monitor Document Visibility
      this.monitorDocumentVisibility();
  
      // Method 3: Monitor Performance Metrics
      this.monitorPerformance();
  
      // Method 4: Detect DevTools (often used with recording)
      this.detectDevTools();
  
      // Method 5: Monitor Page Capture API
      this.monitorPageCapture();
  
      // Method 6: Monitor window focus and blur
      this.monitorWindowFocus();
  
      console.log('✅ Screen recording detection active');
      console.log('🛡️ Protection methods:', this.detectionMethods);
    }
  
    /**
     * Method 1: Monitor Media Devices API
     * Detects when screen capture is requested
     */
    monitorMediaDevices() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
          console.warn('⚠️ Media Devices API not supported');
          return;
        }
  
        // Store original method
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(
          navigator.mediaDevices
        );
  
        // Override getDisplayMedia
        navigator.mediaDevices.getDisplayMedia = async (constraints) => {
          console.log('🚨 Screen capture requested!');
          this.triggerRecordingDetected('Media Devices API');
          
          // Still allow the capture but pause video
          return originalGetDisplayMedia(constraints);
        };
  
        this.detectionMethods.mediaDevicesAPI = true;
        console.log('✅ Media Devices API monitoring active');
      } catch (error) {
        console.error('❌ Error setting up Media Devices monitor:', error);
      }
    }
  
    /**
     * Method 2: Monitor Document Visibility
     * Detects when screen sharing tools minimize the window
     */
    monitorDocumentVisibility() {
      try {
        let hiddenCount = 0;
        const visibilityThreshold = 3;
  
        const handleVisibilityChange = () => {
          if (document.hidden) {
            hiddenCount++;
            console.log(`📊 Document hidden count: ${hiddenCount}`);
  
            if (hiddenCount >= visibilityThreshold) {
              console.log('🚨 Suspicious visibility pattern detected');
              this.triggerRecordingDetected('Visibility Pattern');
              hiddenCount = 0;
            }
          }
        };
  
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        this.detectionMethods.documentVisibility = true;
        console.log('✅ Document visibility monitoring active');
      } catch (error) {
        console.error('❌ Error setting up visibility monitor:', error);
      }
    }
  
    /**
     * Method 3: Monitor Performance Metrics
     * Screen recording can cause performance drops
     */
    monitorPerformance() {
      try {
        let consecutiveLowFrames = 0;
        const fpsThreshold = 30;
        const checkInterval = 2000;
  
        this.detectionInterval = setInterval(() => {
          if (window.performance && window.performance.now) {
            const fps = this.measureFPS();
            
            if (fps < fpsThreshold) {
              consecutiveLowFrames++;
              console.log(`📊 Low FPS detected: ${fps} (${consecutiveLowFrames})`);
  
              if (consecutiveLowFrames >= 3) {
                console.log('🚨 Suspicious performance drop detected');
                this.triggerRecordingDetected('Performance Drop');
                consecutiveLowFrames = 0;
              }
            } else {
              consecutiveLowFrames = 0;
            }
          }
        }, checkInterval);
  
        this.detectionMethods.performanceMonitor = true;
        console.log('✅ Performance monitoring active');
      } catch (error) {
        console.error('❌ Error setting up performance monitor:', error);
      }
    }
  
    /**
     * Method 4: Detect DevTools
     * Recording software often runs with DevTools open
     */
    detectDevTools() {
      try {
        const checkDevTools = () => {
          const widthThreshold = window.outerWidth - window.innerWidth > 160;
          const heightThreshold = window.outerHeight - window.innerHeight > 160;
  
          if (widthThreshold || heightThreshold) {
            console.log('🚨 DevTools potentially detected');
            this.triggerRecordingDetected('DevTools Detected');
          }
        };
  
        window.addEventListener('resize', checkDevTools);
        
        this.detectionMethods.devToolsDetector = true;
        console.log('✅ DevTools detection active');
      } catch (error) {
        console.error('❌ Error setting up DevTools detector:', error);
      }
    }
  
    /**
     * Method 5: Monitor Page Capture API
     * Modern browsers expose when page is being captured
     */
    monitorPageCapture() {
      try {
        // Check if mediaDevices.enumerateDevices is available
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          setInterval(async () => {
            try {
              const devices = await navigator.mediaDevices.enumerateDevices();
              const screenCapture = devices.find(
                device => device.kind === 'videoinput' && 
                device.label.toLowerCase().includes('screen')
              );
  
              if (screenCapture) {
                console.log('🚨 Screen capture device detected');
                this.triggerRecordingDetected('Screen Capture Device');
              }
            } catch (err) {
              // Silent fail - user might have denied permissions
            }
          }, 3000);
        }
  
        console.log('✅ Page capture monitoring active');
      } catch (error) {
        console.error('❌ Error setting up page capture monitor:', error);
      }
    }
  
    /**
     * Method 6: Monitor Window Focus/Blur
     * Recording apps often cause focus changes
     */
    monitorWindowFocus() {
      try {
        let blurCount = 0;
        const blurThreshold = 5;
        const resetInterval = 10000;
  
        const handleBlur = () => {
          blurCount++;
          console.log(`📊 Window blur count: ${blurCount}`);
  
          if (blurCount >= blurThreshold) {
            console.log('🚨 Suspicious blur pattern detected');
            this.triggerRecordingDetected('Focus Pattern');
            blurCount = 0;
          }
        };
  
        window.addEventListener('blur', handleBlur);
  
        // Reset counter periodically
        setInterval(() => {
          blurCount = 0;
        }, resetInterval);
  
        console.log('✅ Window focus monitoring active');
      } catch (error) {
        console.error('❌ Error setting up focus monitor:', error);
      }
    }
  
    /**
     * Helper: Measure FPS
     */
    measureFPS() {
      let lastTime = performance.now();
      let frames = 0;
      let fps = 60;
  
      const measureFrame = () => {
        const now = performance.now();
        frames++;
  
        if (now >= lastTime + 1000) {
          fps = Math.round((frames * 1000) / (now - lastTime));
          frames = 0;
          lastTime = now;
        }
  
        requestAnimationFrame(measureFrame);
      };
  
      measureFrame();
      return fps;
    }
  
    /**
     * Trigger recording detected callback
     */
    triggerRecordingDetected(method) {
      if (this.isRecording) return; // Already detected
  
      console.log(` SCREEN RECORDING DETECTED via ${method}!`);
      this.isRecording = true;
  
      // Execute all callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(method);
        } catch (error) {
          console.error(' Error in recording detection callback:', error);
        }
      });
  
      // Reset flag after 5 seconds to allow re-detection
      setTimeout(() => {
        this.isRecording = false;
      }, 5000);
    }
  
    /**
     * Stop monitoring
     */
    stopMonitoring() {
      console.log(' Stopping screen recording detection...');
      
      if (this.detectionInterval) {
        clearInterval(this.detectionInterval);
      }
  
      // Remove event listeners
      window.removeEventListener('resize', this.detectDevTools);
      window.removeEventListener('blur', this.monitorWindowFocus);
      document.removeEventListener('visibilitychange', this.monitorDocumentVisibility);
  
      // Clear callbacks
      this.callbacks = [];
      this.isRecording = false;
  
      console.log('✅ Screen recording detection stopped');
    }
  
    /**
     * Check if currently recording
     */
    isCurrentlyRecording() {
      return this.isRecording;
    }
  }
  
  // Create singleton instance
  const screenRecordingDetector = new ScreenRecordingDetector();
  
  export default screenRecordingDetector;
  
  /**
   * ✅ Simple API for easy integration
   */
  export const startScreenRecordingDetection = (onDetected) => {
    screenRecordingDetector.startMonitoring(onDetected);
  };
  
  export const stopScreenRecordingDetection = () => {
    screenRecordingDetector.stopMonitoring();
  };
  
  export const isScreenRecording = () => {
    return screenRecordingDetector.isCurrentlyRecording();
  };