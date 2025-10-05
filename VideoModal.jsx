import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Reusable modal that plays a local video with controls and fullscreen toggle.
 * - Primary button opens modal (customizable text via props)
 * - Autoplays video on open
 * - Closes when clicking the overlay or the close button
 * - On close, the video is paused and reset to the beginning
 * - Includes a fullscreen toggle button
 */
export default function VideoModal({
  buttonText = 'Ver video',
  videoSrc = '/video_demo/demo_securehire.mp4',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  const open = () => setIsOpen(true);

  const close = useCallback(() => {
    setIsOpen(false);
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
        video.currentTime = 0;
      } catch (_) {
        // ignore
      }
    }
    // Exit fullscreen if active
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFs(false);
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // Play when opened
  useEffect(() => {
    const video = videoRef.current;
    if (isOpen && video) {
      video.play().catch(() => {});
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // Overlay click to close (ignore clicks inside the dialog)
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) close();
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFs(true);
      } else {
        await document.exitFullscreen();
        setIsFs(false);
      }
    } catch (_) {
      // ignore
    }
  };

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={open}
        className="px-4 py-2 rounded-full bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
      >
        {buttonText}
      </button>

      {isOpen && (
        <div
          ref={overlayRef}
          onClick={onOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity"
          aria-modal="true"
          role="dialog"
        >
          <div className="relative mx-4">
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute -top-3 -right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow hover:bg-white"
            >
              ×
            </button>

            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="absolute -bottom-3 right-1/2 translate-x-1/2 z-10 inline-flex h-8 items-center gap-2 rounded-full bg-white/90 px-3 text-sm text-black shadow hover:bg-white"
            >
              {isFs ? 'Salir de pantalla completa' : 'Pantalla completa'}
            </button>

            <video
              ref={videoRef}
              src={videoSrc}
              controls
              autoPlay
              className="max-w-3xl w-full rounded-lg bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}


