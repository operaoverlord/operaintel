"use client";

import { useEffect, useRef } from "react";

export default function CesiumClient() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("Cesium placeholder running");
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: "absolute", inset: 0, background: "black" }}
    />
  );
}