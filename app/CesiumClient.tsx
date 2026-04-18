"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Cesium?: any;
  }
}

export default function CesiumClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let viewer: any = null;
    let cancelled = false;
    let handler: any = null;
    let moveInterval: number | null = null;

    async function run() {
      if (!document.getElementById("cesium-widgets-css")) {
        const link = document.createElement("link");
        link.id = "cesium-widgets-css";
        link.rel = "stylesheet";
        link.href =
          "https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Widgets/widgets.css";
        document.head.appendChild(link);
      }

      if (!window.Cesium) {
        await new Promise<void>((resolve, reject) => {
          const existing = document.getElementById(
            "cesium-js"
          ) as HTMLScriptElement | null;

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
          script.onerror = () =>
            reject(new Error("new script failed to load"));
          document.body.appendChild(script);
        });
      }

      if (cancelled || !containerRef.current || !window.Cesium) return;

      const Cesium = window.Cesium;

      Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMTRlZmI4NS1hNzRiLTRjNGUtODU1ZC1iMTU4MzZmNjI0ODMiLCJpZCI6NDE5ODE2LCJpYXQiOjE3NzY0ODUwMjV9.z5cryd76z8Ecf5kfKY77MBMe_34wym0RMMbSX3t6A4I";

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
        shouldAnimate: true,
      });

      // START VIEW → HORMUZ
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(56.5, 26.2, 900000),
      });

      const flights = [
        {
          id: "hormuz-track-1",
          name: "FLIGHT A01",
          type: "CARGO",
          color: Cesium.Color.ORANGE,
          lon: 56.25,
          lat: 26.45,
          alt: 12000,
          dLon: 0.015,
          dLat: 0.004,
        },
        {
          id: "hormuz-track-2",
          name: "FLIGHT B12",
          type: "PASSENGER",
          color: Cesium.Color.CYAN,
          lon: 56.55,
          lat: 26.9,
          alt: 11000,
          dLon: -0.012,
          dLat: -0.003,
        },
        {
          id: "hormuz-track-3",
          name: "FLIGHT C07",
          type: "MILITARY",
          color: Cesium.Color.RED,
          lon: 56.85,
          lat: 25.95,
          alt: 13000,
          dLon: 0.01,
          dLat: 0.005,
        },
      ];

      const entities = flights.map((flight) =>
        viewer.entities.add({
          id: flight.id,
          name: flight.name,
          position: Cesium.Cartesian3.fromDegrees(
            flight.lon,
            flight.lat,
            flight.alt
          ),
          point: {
            pixelSize: 12,
            color: flight.color,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 1,
          },
          label: {
            text: flight.name,
            font: "12px monospace",
            fillColor: flight.color,
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
            pixelOffset: new Cesium.Cartesian2(0, -20),
          },
        })
      );

      // CLICK HANDLER (no popup)
      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction((click: any) => {
        const picked = viewer.scene.pick(click.position);

        if (Cesium.defined(picked) && picked.id) {
          console.log("SELECTED:", picked.id.id);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // MOVEMENT
      moveInterval = window.setInterval(() => {
        flights.forEach((flight, index) => {
          flight.lon += flight.dLon;
          flight.lat += flight.dLat;

          if (flight.lon > 57.2 || flight.lon < 55.8) {
            flight.dLon *= -1;
          }

          if (flight.lat > 27.3 || flight.lat < 25.6) {
            flight.dLat *= -1;
          }

          entities[index].position = Cesium.Cartesian3.fromDegrees(
            flight.lon,
            flight.lat,
            flight.alt
          );
        });
      }, 1000);
    }

    run();

    return () => {
      cancelled = true;

      if (moveInterval !== null) window.clearInterval(moveInterval);
      if (handler) handler.destroy();
      if (viewer && !viewer.isDestroyed()) viewer.destroy();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}