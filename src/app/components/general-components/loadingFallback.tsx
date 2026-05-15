import React from "react";

interface LoadingFallbackProps {
  message?: string;
  className?: string;
  fullPage?: boolean;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = "Loading TaskFlow...",
  className = "",
  fullPage = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 bg-[#fcfcfb]/60 backdrop-blur-[2px] transition-all duration-500 animate-in fade-in ${
        fullPage ? "fixed inset-0 z-9999 h-screen w-screen" : "h-full w-full py-12"
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="h-12 w-12 rounded-full border-2 border-[#064e3b]/10"></div>
        {/* Animated Ring */}
        <div className="absolute h-12 w-12 animate-spin rounded-full border-t-2 border-[#064e3b] shadow-sm"></div>
        
        {/* Inner Pulse */}
        <div className="absolute h-2 w-2 animate-pulse rounded-full bg-[#064e3b]/40"></div>
      </div>
      
      {message && (
        <div className="flex flex-col items-center gap-1">
          <span className="font-manrope text-[11px] font-black uppercase tracking-[0.2em] text-[#064e3b]/70 animate-pulse">
            {message}
          </span>
          <div className="h-0.5 w-24 overflow-hidden rounded-full bg-[#064e3b]/10">
            <div className="h-full w-full origin-left animate-loading-bar rounded-full bg-[#064e3b]/40"></div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes loading-bar {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(0.7); }
            100% { transform: scaleX(0); transform-origin: right; }
          }
          .animate-loading-bar {
            animation: loading-bar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LoadingFallback;
