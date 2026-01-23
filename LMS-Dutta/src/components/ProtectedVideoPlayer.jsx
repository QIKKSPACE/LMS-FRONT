import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Warning, Block, Security } from '@mui/icons-material';
import screenRecordingDetector from '../services/screenRecordingDetector';
import toast from 'react-hot-toast';


const ProtectedVideoPlayer = ({ 
  videoUrl, 
  lectureTitle,
  onTimeUpdate,
  onEnded,
  onPlay,
  onPause,
  className = "",
  autoPlay = false
}) => {
  const videoRef = useRef(null);
  const [isRecordingDetected, setIsRecordingDetected] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState('');
  const [videoBlocked, setVideoBlocked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const recordingWarningShown = useRef(false);

  useEffect(() => {
    console.log('🔒 Initializing protected video player for:', lectureTitle);

    // Start screen recording detection
    screenRecordingDetector.startMonitoring((method) => {
      console.log('🚨 Recording detected via:', method);
      handleRecordingDetected(method);
    });

    // Cleanup on unmount
    return () => {
      console.log('🛑 Cleaning up protected video player');
      screenRecordingDetector.stopMonitoring();
    };
  }, [lectureTitle]);

  /**
   * Handle recording detection
   */
  const handleRecordingDetected = (method) => {
    console.log('🚨 SCREEN RECORDING DETECTED!');
    setIsRecordingDetected(true);
    setDetectionMethod(method);
    setVideoBlocked(true);
    setShowWarning(true);

    // Pause video immediately
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      console.log('⏸️ Video paused due to recording detection');
    }

    // Show persistent warning toast
    if (!recordingWarningShown.current) {
      toast.error(
        '🚨 Screen recording detected! Video has been paused for copyright protection.',
        {
          duration: 8000,
          icon: '🔒',
          style: {
            border: '2px solid #ef4444',
            padding: '16px',
            fontWeight: 'bold',
          },
        }
      );
      recordingWarningShown.current = true;
    }

    // Keep warning visible for 10 seconds
    setTimeout(() => {
      setShowWarning(false);
    }, 10000);
  };

  /**
   * Handle video play attempt
   */
  const handlePlayAttempt = (e) => {
    if (videoBlocked) {
      e.preventDefault();
      toast.error('⛔ Video playback is blocked. Stop screen recording to continue.', {
        duration: 4000,
        icon: '🔒'
      });
      return false;
    }

    if (onPlay) {
      onPlay(e);
    }
  };

  /**
   * Handle video pause
   */
  const handlePause = (e) => {
    if (onPause && !videoBlocked) {
      onPause(e);
    }
  };

  /**
   * Unblock video (after user stops recording)
   */
  const handleUnblock = () => {
    setVideoBlocked(false);
    setIsRecordingDetected(false);
    setShowWarning(false);
    recordingWarningShown.current = false;
    
    toast.success('✅ Video playback enabled. You can now play the lecture.', {
      duration: 3000,
      icon: '▶️'
    });
  };

  /**
   * Block right-click on video
   */
  const handleContextMenu = (e) => {
    e.preventDefault();
    toast.error('Right-click is disabled on video player', {
      duration: 2000,
      icon: '🚫'
    });
    return false;
  };

  return (
    <div className="relative w-full h-full">
      {/* Protected Video Element */}
      <video
        ref={videoRef}
        className={`w-full h-full ${className}`}
        src={videoUrl}
        controls={!videoBlocked}
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        autoPlay={autoPlay && !videoBlocked}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onPlay={handlePlayAttempt}
        onPause={handlePause}
        onContextMenu={handleContextMenu}
        style={{
          filter: videoBlocked ? 'blur(20px)' : 'none',
          pointerEvents: videoBlocked ? 'none' : 'auto'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Recording Detection Overlay */}
      <AnimatePresence>
        {videoBlocked && (
          <motion.div
            className="absolute inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center px-6 max-w-md">
              {/* Icon */}
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                transition={{ 
                  scale: { type: "spring", stiffness: 200, damping: 10 },
                  rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
                }}
              >
                <div className="w-24 h-24 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                  <Block style={{ fontSize: '48px', color: 'white' }} />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                🚨 Screen Recording Detected
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-gray-300 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                For copyright protection, this video has been automatically paused. 
                Please <strong className="text-red-400">stop screen recording</strong> to continue watching.
              </motion.p>

              {/* Detection Method */}
              <motion.div
                className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-red-300">
                  <Security style={{ fontSize: '16px', marginRight: '8px' }} />
                  Detection Method: <strong>{detectionMethod}</strong>
                </p>
              </motion.div>

              {/* Resume Button */}
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                onClick={handleUnblock}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                I've Stopped Recording - Resume Video
              </motion.button>

              {/* Help Text */}
              <motion.p
                className="text-xs text-gray-500 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                If you're not recording, please check your screen sharing apps and browser extensions.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning Banner (Top of video) */}
      <AnimatePresence>
        {showWarning && !videoBlocked && (
          <motion.div
            className="absolute top-4 left-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-2xl z-40 flex items-center gap-3"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Warning style={{ fontSize: '24px' }} />
            <div className="flex-1">
              <p className="font-bold">Recording Activity Detected</p>
              <p className="text-xs">Video will pause if recording continues</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Protection Badge (Bottom Right) */}
      <motion.div
        className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 z-30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Security style={{ fontSize: '16px' }} />
        <span>Protected Content</span>
      </motion.div>
    </div>
  );
};

export default ProtectedVideoPlayer;