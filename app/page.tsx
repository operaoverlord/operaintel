"use client";

import dynamic from "next/dynamic";

const CesiumClient = dynamic(() => import("./CesiumClient"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">

      {/* GLOBE */}
      <div className="absolute inset-0">
        <CesiumClient />
      </div>

      {/* OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* LEFT PANEL */}
      <div className="absolute top-4 left-4 z-10 w-[260px] md:w-[300px] bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-4">
  <div className="text-xs tracking-widest text-purple-400 animate-pulse font-mono drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]">
    OPERA INTELLIGENCE
  </div>
  <div className="text-lg mt-2 text-white">
    SYSTEM ACTIVE
  </div>
</div>

      {/* RIGHT PANEL */}
      <div className="absolute top-4 right-4 z-10 w-[260px] md:w-[320px] bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <div className="text-xs text-white/60 tracking-widest">
          TACTICAL PANEL
        </div>
        <div className="text-sm mt-2 text-white/70">
          Monitoring live environment feed.
        </div>
      </div>

      {/* TIMELINE */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/80 border-t border-white/10 p-4">
        <input type="range" className="w-full" />
      </div>

    </main>
  );
}