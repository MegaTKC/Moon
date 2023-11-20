// index.js

import express from "express";
import { createServer } from "node:http";
import { publicPath } from "ultraviolet-static";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { join } from "node:path";
import { hostname } from "node:os";
import Corrosion from "corrosion";
import { createBareServer } from "@tomphttp/bare-server-node";
import Unblocker from "unblocker";

const bare = createBareServer("/bare/");
const app = express();

const corrosion = new Corrosion({
  codec: "xor",
  prefix: "/co/",
});

// Load our publicPath first and prioritize it over UV.
app.use(express.static(publicPath));
// Load vendor files last.
// The vendor's uv.config.js won't conflict with our uv.config.js inside the publicPath directory.
app.use("/uv/", express.static(uvPath));

// Error for everything else
app.use((req, res, next) => {
  if (req.url.startsWith("/ub/")) {
    // If the URL starts with "/ub/", let unblocker handle it
    return next();
  }

  res.status(404);
  res.sendFile(join(publicPath, "404.html"));
});

// Initialize Unblocker with the prefix '/ub/'
const unblocker = Unblocker({
  prefix: "/ub/",
});

app.use(unblocker);

const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else if (req.url.startsWith(corrosion.prefix)) {
    corrosion.request(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else if (req.url.startsWith(corrosion.prefix)) {
    corrosion.upgrade(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();

  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

corrosion.bundleScripts();

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bare.close();
  process.exit(0);
}

server.listen({
  port,
});
