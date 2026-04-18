"use client";

import dynamic from "next/dynamic";

const CesiumClient = dynamic(() => import("./CesiumClient"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 9999,
          color: "red",
        }}
      >
        MOBILE TEST 123
      </div>

      <div className="absolute inset-0">
        <CesiumClient />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      <div className="absolute left-4 top-4 z-10 w-[260px] rounded-xl border border-white/10 bg-black/70 p-4 backdrop-blur-md md:w-[300px]">
        <div className="text-xs tracking-widest text-white/60">OPERA INTEL</div>
        <div className="mt-2 text-lg">SYSTEM ACTIVE</div>
      </div>

      <div className="absolute right-4 top-4 z-10 w-[260px] rounded-xl border border-white/10 bg-black/70 p-4 backdrop-blur-md md:w-[320px]">
        <div className="text-xs tracking-widest text-white/60">TACTICAL PANEL</div>
        <div className="mt-2 text-sm text-white/70">
          Monitoring live environment feed.
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/80 p-4">
        <input type="range" className="w-full" />
      </div>
    </main>
  );
}