'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/cn';
import { toBengaliNumerals } from '@/lib/bengali-utils';

interface AudioPlayerProps {
  audioUrl: string;
  narratorBn?: string | null;
  durationSec?: number | null;
}

export function AudioPlayer({ audioUrl, narratorBn, durationSec }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${toBengaliNumerals(m)}:${toBengaliNumerals(s).padStart(2, '০')}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime: ct, duration } = audioRef.current;
    setCurrentTime(ct);
    setProgress(duration ? (ct / duration) * 100 : 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * (audioRef.current.duration || 0);
  };

  return (
    <div className="bg-gradient-to-r from-crimson/5 to-ochre/5 border border-crimson/15 rounded-2xl p-5 mt-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎧</span>
        <h3 className="font-ui font-semibold text-sm text-[var(--text-primary)]">
          শ্রাব্য গল্প
        </h3>
        {narratorBn && (
          <span className="text-xs text-ink/50 font-ui ml-auto">পাঠক: {narratorBn}</span>
        )}
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* Progress bar */}
      <div
        className="h-1.5 bg-ink/10 rounded-full mb-3 cursor-pointer relative overflow-hidden"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-crimson rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
            'bg-crimson text-white hover:bg-crimson-dark shadow-sm'
          )}
          aria-label={isPlaying ? 'বিরতি' : 'চালান'}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <span className="text-xs text-ink/50 font-ui">
          {formatTime(currentTime)}
          {durationSec && ` / ${formatTime(durationSec)}`}
        </span>
      </div>
    </div>
  );
}
