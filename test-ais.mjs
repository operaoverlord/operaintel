import WebSocket from "ws";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/^AISSTREAM_API_KEY=(.+)$/m);

if (!match) {
  console.log("NO KEY FOUND IN .env.local");
  process.exit(1);
}

const apiKey = match[1].trim();

const socket = new WebSocket("wss://stream.aisstream.io/v0/stream");

socket.on("open", () => {
  console.log("CONNECTED");

  socket.send(
    JSON.stringify({
      APIKey: apiKey,
      BoundingBoxes: [[[24, 54], [30, 60]]],
    })
  );
});

socket.on("message", (data) => {
  console.log("RAW MESSAGE:", data.toString().slice(0, 300));
});

socket.on("error", (err) => {
  console.log("SOCKET ERROR:", err);
});

socket.on("close", (code, reason) => {
  console.log("CLOSE CODE:", code);
  console.log("CLOSE REASON:", reason.toString());
});

setTimeout(() => {
  console.log("CLOSING");
  socket.close();
}, 10000);