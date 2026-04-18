"use client";

import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

export default function CesiumClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // @ts-ignore
    window.CESIUM_BASE_URL = "/cesium";

    Cesium.Ion.defaultAccessToken =
      process.env.NEXT_PUBLIC_CESIUM_TOKEN || "";

    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      baseLayerPicker: false,
      timeline: false,
      terrain: Cesium.Terrain.fromWorldTerrain(),
    });

    return () => {
      if (!viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ position: "absolute", inset: 0 }}
    />
  );
}