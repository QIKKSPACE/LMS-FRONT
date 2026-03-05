import { useEffect, useRef } from "react";
import Hls from "hls.js";

const HlsPlayer = ({
  src,
  onTimeUpdate,
  onEnded,
  onPlay,
  onPause,
  className,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari support
      videoRef.current.src = src;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      className={className}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
      onPlay={onPlay}
      onPause={onPause}
      controlsList="nodownload"
      playsInline
    />
  );
};

export default HlsPlayer;
