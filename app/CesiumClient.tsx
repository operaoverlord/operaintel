"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Cesium?: any;
  }
}

export default function CesiumClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState("mounting");

  useEffect(() => {
    let viewer: any = null;
    let cancelled = false;

    async function run() {
      try {
        setStatus("effect started");

        if (!document.getElementById("cesium-widgets-css")) {
          const link = document.createElement("link");
          link.id = "cesium-widgets-css";
          link.rel = "stylesheet";
          link.href =
            "https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Widgets/widgets.css";
          document.head.appendChild(link);
        }

        setStatus("css added");

        if (!window.Cesium) {
          setStatus("loading script");

          await new Promise<void>((resolve, reject) => {
            const existing = document.getElementById("cesium-js") as HTMLScriptElement | null;

            if (existing) {
              existing.addEventListener("load", () => resolve(), { once: true });
              existing.addEventListener(
                "error",
                () => reject(new Error("existing script failed to load")),
                { once: true }
              );
              return;
            }

            const script = document.createElement("script");
            script.id = "cesium-js";
            script.src =
              "https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Cesium.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("new script failed to load"));
            document.body.appendChild(script);
          });
        }

        if (cancelled) return;

        setStatus(`script loaded: ${!!window.Cesium}`);

        if (!containerRef.current) {
          throw new Error("container missing");
        }

        if (!window.Cesium) {
          throw new Error("window.Cesium missing after script load");
        }

        const Cesium = window.Cesium;

        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMTRlZmI4NS1hNzRiLTRjNGUtODU1ZC1iMTU4MzZmNjI0ODMiLCJpZCI6NDE5ODE2LCJpYXQiOjE3NzY0ODUwMjV9.z5cryd76z8Ecf5kfKY77MBMe_34wym0RMMbSX3t6A4I";
        setStatus("token set");

        viewer = new Cesium.Viewer(containerRef.current, {
          animation: false,
          timeline: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          infoBox: false,
          selectionIndicator: false,
          fullscreenButton: false,
        });

        setStatus("viewer created");

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(-98.5795, 39.8283, 12000000),
        });

        setStatus("done");
      } catch (err: any) {
        setStatus(`ERROR: ${err?.message || String(err)}`);
      }
    }

    run();

    return () => {
      cancelled = true;
      if (viewer && !viewer.isDestroyed()) viewer.destroy();
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 70,
          left: 20,
          zIndex: 10000,
          color: "lime",
          background: "rgba(0,0,0,0.8)",
          padding: "8px 10px",
          fontSize: "12px",
          fontFamily: "monospace",
        }}
      >
        {status}
      </div>

      <div ref={containerRef} className="absolute inset-0" />
    </>
  );
}