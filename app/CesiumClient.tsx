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

    let viewer: Cesium.Viewer | undefined;

    async function init() {

      viewer = new Cesium.Viewer(containerRef.current as HTMLDivElement, {
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
    }

    init();

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}