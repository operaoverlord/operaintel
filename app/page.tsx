"use client";

import dynamic from "next/dynamic";

const CesiumClient = dynamic(() => import("./CesiumClient"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <CesiumClient />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      <div className="absolute left-4 top-4 z-10 w-[260px] rounded-xl border border-white/10 bg-black/70 p-4 backdrop-blur-md md:w-[300px]">
        <div className="text-xs tracking-[0.28em] text-cyan-400/80">
          OPERA INTEL
        </div>
        <div className="mt-2 text-lg font-medium tracking-[0.16em]">
          SYSTEM ACTIVE
        </div>
        <div className="mt-3 text-xs leading-5 text-white/60">
          Live tactical surface. Tracking active airborne objects and event visibility.
        </div>
      </div>

      <div className="absolute right-4 top-4 z-10 w-[260px] rounded-xl border border-white/10 bg-black/70 p-4 backdrop-blur-md md:w-[320px]">
        <div className="text-xs tracking-[0.28em] text-white/60">
          TACTICAL PANEL
        </div>
        <div className="mt-3 space-y-3 text-sm text-white/75">
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            AIR TRACKS ONLINE
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            FEED: SIMULATED
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            STATUS: MONITORING
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/80 p-4 backdrop-blur-md">
        <input type="range" className="w-full" defaultValue={35} />
      </div>
    </main>
  );
}