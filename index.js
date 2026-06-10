Deno.serve((req) => {
  // Target server configured for smileysmp.eagler.host
  const TARGET_SERVER = "smileysmp.eagler.host"; 

  const url = new URL(req.url);
  const targetUrl = new URL(TARGET_SERVER);
  
  targetUrl.pathname = url.pathname;
  targetUrl.search = url.search;

  // Forward the WebSocket handshake required by Eaglercraft
  if (req.headers.get("upgrade") === "websocket") {
    return fetch(targetUrl, req);
  }

  // Handle normal server pings and HTTP requests
  return fetch(targetUrl, req);
});
