import { NextResponse } from "next/server";

export async function GET() {
  const url =
    "https://opensky-network.org/api/states/all?lamin=24&lomin=54&lamax=30&lomax=60";

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    return NextResponse.json([]);
  }

  const data = await res.json();

  const states = Array.isArray(data.states) ? data.states : [];

  const planes = states
    .filter((state: any[]) => state[5] !== null && state[6] !== null)
    .map((state: any[]) => ({
      id: state[0],
      name: (state[1] || state[0] || "UNKNOWN").toString().trim(),
      vesselType: "AIRCRAFT",
      speed: state[9] ?? "--",          // velocity m/s for now
      heading: state[10] ?? "--",       // true track degrees
      altitude: state[7] ?? "--",       // barometric altitude
      lat: state[6],
      lon: state[5],
      status: "LIVE",
      signalType: "ADS-B",
      timestamp: new Date().toISOString(),
      mediaUrl: "",
    }));

  return NextResponse.json(planes);
}