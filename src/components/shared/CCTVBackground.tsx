import { useState } from 'react';

export function CCTVBackground() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Sketchfab Embed URL with parameters to hide UI elements and auto-start
  // Parameters used:
  // autostart=1 (auto start 3D)
  // ui_infos=0 (hide title)
  // ui_watermark=0 (try to hide watermark if allowed)
  // ui_help=0 (hide help button)
  // ui_settings=0 (hide settings button)
  // ui_inspector=0 (hide inspector button)
  // ui_animations=0 (hide animations button)
  // ui_theme=dark (dark theme for loading)
  // transparent=1 (transparent background to let CSS shine through)
  const sketchfabUrl = "https://sketchfab.com/models/4d9f1409d26847dca3f73a0e4464bc13/embed?autostart=1&ui_infos=0&ui_watermark_link=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_animations=0&ui_theme=dark&transparent=1&dnt=1";

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#030712]">
      
      {/* 1. Base Grid Layer */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* 2. Cyberpunk / Holographic ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
      <div className="absolute bottom-1/4 translate-x-1/2 -right-1/4 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* 3. Sketchfab Iframe (UI 버튼들이 렌더링되는 가장자리 영역을 숨기기 위해 컨테이너를 더 크게 확장하여 크롭) */}
      <div className="absolute -top-[100px] -bottom-[100px] -left-[100px] -right-[100px] z-10 pointer-events-auto transition-opacity duration-1000 ease-in-out">
        <iframe
          title="CyberCCTV"
          className="w-full h-full border-0 outline-none sepia-[.8] hue-rotate-[200deg] saturate-[1.5] contrast-[1.1] brightness-[0.85] mix-blend-luminosity"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          xr-spatial-tracking="true"
          execution-while-out-of-viewport="true"
          execution-while-not-rendered="true"
          web-share="true"
          src={sketchfabUrl}
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* 3.5. Deep Blue Color Grading Overlay */}
      <div className="absolute inset-0 z-[15] pointer-events-none bg-blue-950/60 mix-blend-color" />
      <div className="absolute inset-0 z-[15] pointer-events-none bg-indigo-900/40 mix-blend-multiply" />

      {/* 4. Foreground UI Overlays (Scanlines & Vignette) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Scanlines */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 50%)`,
            backgroundSize: '100% 4px'
          }}
        />
        {/* Vignette Gradient for dramatic focus */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.7)_80%)]" />
        
        {/* Left-edge HUD elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-64 border-l-2 border-cyan-500/30 flex flex-col justify-between py-4 pl-2">
            {[1,2,3,4,5].map(i => (
                <div key={i} className="w-2 h-[2px] bg-cyan-400/50" />
            ))}
        </div>
      </div>

      {/* 5. Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#030712] transition-opacity duration-500">
           <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
              <div className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">
                INITIALIZING NEURAL LINK...
              </div>
           </div>
        </div>
      )}
      
      {/* 6. Dynamic Floating Labels / Targeting Reticle */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
         {/* Center Reticle */}
         <div className="w-64 h-64 border border-cyan-500/10 rounded-full relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-cyan-400/50" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-cyan-400/50" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-cyan-400/50" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-cyan-400/50" />
         </div>
      </div>

      {/* Diagnostic Display */}
      <div className="absolute top-8 right-8 z-20 pointer-events-none">
          <div className="flex flex-col items-end gap-1 font-mono text-[10px] text-cyan-400/70">
              <div className="flex items-center gap-2">
                  <span className="animate-pulse flex h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                  SYS.ONLINE
              </div>
              <div>LATENCY: 12ms</div>
              <div>SEC_LEVEL: ALPHA</div>
          </div>
      </div>

    </div>
  );
}
