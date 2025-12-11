'use client';

import { useEffect } from 'react';

interface ImageModalProps {
  imageUrl: string;
  imageAlt: string;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, imageAlt, onClose }: ImageModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Close modal"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        className="relative max-h-full max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-h-[90vh] max-w-full rounded-lg object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'rounded-lg bg-red-500/20 p-8 text-center text-white';
            errorDiv.textContent = 'Failed to load image';
            e.target.parentElement?.appendChild(errorDiv);
          }}
        />
      </div>
    </div>
  );
}

