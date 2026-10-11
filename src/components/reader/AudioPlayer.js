'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { cn } from '@/lib/cn';
import { toBengaliNumerals } from '@/lib/bengali-utils';
export function AudioPlayer({ audioUrl, narratorBn, durationSec }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);
    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${toBengaliNumerals(m)}:${toBengaliNumerals(s).padStart(2, '০')}`;
    };
    const togglePlay = () => {
        if (!audioRef.current)
            return;
        if (isPlaying) {
            audioRef.current.pause();
        }
        else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    const handleTimeUpdate = () => {
        if (!audioRef.current)
            return;
        const { currentTime: ct, duration } = audioRef.current;
        setCurrentTime(ct);
        setProgress(duration ? (ct / duration) * 100 : 0);
    };
    const handleSeek = (e) => {
        if (!audioRef.current)
            return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = ratio * (audioRef.current.duration || 0);
    };
    return (_jsxs("div", { className: "bg-gradient-to-r from-crimson/5 to-ochre/5 border border-crimson/15 rounded-2xl p-5 mt-8", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("span", { className: "text-lg", children: "\uD83C\uDFA7" }), _jsx("h3", { className: "font-ui font-semibold text-sm text-[var(--text-primary)]", children: "\u09B6\u09CD\u09B0\u09BE\u09AC\u09CD\u09AF \u0997\u09B2\u09CD\u09AA" }), narratorBn && (_jsxs("span", { className: "text-xs text-ink/50 font-ui ml-auto", children: ["\u09AA\u09BE\u09A0\u0995: ", narratorBn] }))] }), _jsx("audio", { ref: audioRef, src: audioUrl, onTimeUpdate: handleTimeUpdate, onEnded: () => setIsPlaying(false), className: "hidden" }), _jsx("div", { className: "h-1.5 bg-ink/10 rounded-full mb-3 cursor-pointer relative overflow-hidden", onClick: handleSeek, children: _jsx("div", { className: "h-full bg-crimson rounded-full transition-all", style: { width: `${progress}%` } }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: togglePlay, className: cn('w-10 h-10 rounded-full flex items-center justify-center transition-colors', 'bg-crimson text-white hover:bg-crimson-dark shadow-sm'), "aria-label": isPlaying ? 'বিরতি' : 'চালান', children: isPlaying ? (_jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" }) })) : (_jsx("svg", { className: "w-4 h-4 ml-0.5", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M8 5v14l11-7z" }) })) }), _jsxs("span", { className: "text-xs text-ink/50 font-ui", children: [formatTime(currentTime), durationSec && ` / ${formatTime(durationSec)}`] })] })] }));
}
