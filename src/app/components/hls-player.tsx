"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";

interface HlsPlayerProps {
  url: string;
  onProgress?: (state: { played: number }) => void;
  onEnded?: () => void;
}

export default function HlsPlayer({ url, onProgress, onEnded }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!videoRef.current || !url) return;

    const video = videoRef.current;

    // Prevent multiple initializations
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const handleTimeUpdate = () => {
      if (video.duration) {
        const played = video.currentTime / video.duration;
        const progressPercentage = Math.floor(played * 100);
        setProgress(progressPercentage);
        onProgress?.({ played });
      }
    };

    const handleEnded = () => {
      setProgress(100);
      setIsCompleted(true);
      onEnded?.();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url]); // only re-run when url changes

  return (
 

      <video
        ref={videoRef}
        controls
        playsInline
        autoPlay
        controlsList="nodownload"
        style={{ width: "100%", height: "100%" }}
      />
  )}