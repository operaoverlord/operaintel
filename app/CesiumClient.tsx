if (typeof window !== 'undefined') {
  // @ts-ignore
  window.CESIUM_BASE_URL = '/cesium'
}

"use client";

import { useEffect, useRef } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";

export default function CesiumClient({
  onSelectEvent,
  visibleEventCount,
  setCurrentRegion,
}: any) {
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let viewer: any;
    let handler: any;
    let cancelled = false;

    const init = async () => {
      const Cesium = await import("cesium");

      (window as any).CESIUM_BASE_URL = "/cesium";

      if (!viewerRef.current || cancelled) return;

      viewer = new Cesium.Viewer(viewerRef.current, {
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

      if (!viewer || viewer.isDestroyed?.()) return;

      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.baseColor = Cesium.Color.BLACK;

      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(55, 25, 20000000),
      });

      if (setCurrentRegion) {
        setCurrentRegion("HORMUZ");
      }

      let livePlanes: any[] = [];

      try {
        const res = await fetch("/api/ais", { cache: "no-store" });
        if (res.ok) {
          livePlanes = await res.json();
        }
      } catch (error) {
        console.error("Plane fetch failed:", error);
      }

      const planes = Array.isArray(livePlanes)
        ? livePlanes.slice(0, visibleEventCount)
        : [];

      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction((click: any) => {
        const picked = viewer.scene.pick(click.position);

        if (picked && picked.id) {
          const safeDescription =
            typeof picked.id.description?.getValue === "function"
              ? picked.id.description.getValue()
              : typeof picked.id.description === "string"
              ? picked.id.description
              : picked.id.vesselType || "AIRCRAFT TRACK";

          onSelectEvent({
            name: picked.id.name,
            description: safeDescription,
            vesselType: picked.id.vesselType || "AIRCRAFT",
            status: picked.id.status || "LIVE",
            speed: picked.id.speed ?? "--",
            heading: picked.id.heading ?? "--",
            altitude: picked.id.altitude ?? "--",
            signalType: picked.id.signalType || "ADS-B",
            timestamp: picked.id.timestamp || "--",
            mediaUrl: picked.id.mediaUrl || "",
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      planes.forEach((plane: any) => {
        if (!viewer || viewer.isDestroyed?.()) return;

        viewer.entities.add({
          name: plane.name || plane.id || "UNKNOWN AIRCRAFT",
          description: "AIRCRAFT TRACK",
          vesselType: "AIRCRAFT",
          status: plane.status || "LIVE",
          speed: plane.speed ?? "--",
          heading: plane.heading ?? "--",
          altitude: plane.altitude ?? "--",
          signalType: plane.signalType || "ADS-B",
          timestamp: plane.timestamp || new Date().toISOString(),
          mediaUrl: plane.mediaUrl || "",

          position: new Cesium.CallbackProperty(() => {
            const speed = Number(plane.speed || 0);
            const heading = Number(plane.heading || 0) * (Math.PI / 180);
            const distance = speed * 0.00005;

            plane.lon = Number(plane.lon) + Math.sin(heading) * distance;
            plane.lat = Number(plane.lat) + Math.cos(heading) * distance;

            return Cesium.Cartesian3.fromDegrees(
              Number(plane.lon),
              Number(plane.lat),
              Number(plane.altitude || 10000)
            );
          }, false),

          point: {
            pixelSize: new Cesium.CallbackProperty(() => {
              return 10 + Math.sin(Date.now() / 300) * 4;
            }, false),
            color: Cesium.Color.LIME,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
      });
    };

    init();

    return () => {
      cancelled = true;
      if (handler) handler.destroy();
      if (viewer && !viewer.isDestroyed?.()) viewer.destroy();
    };
  }, [visibleEventCount, onSelectEvent, setCurrentRegion]);

  return <div ref={viewerRef} style={{ width: "100vw", height: "100vh" }} />;
}