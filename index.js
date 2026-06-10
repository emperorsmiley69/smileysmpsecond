Deno.serve((req) => {
  // 1. Verify if the client is opening an Eaglercraft WebSocket
  if (req.headers.get("upgrade") === "websocket") {
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);

    clientSocket.onopen = () => {
      // 2. Open a direct connection to your smileysmp server
      const serverSocket = new WebSocket("wss://smileysmp.eagler.host");

      // 3. Pipe incoming data from smileysmp back to the player
      serverSocket.onmessage = (event) => {
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(event.data);
        }
      };

      // 4. Pipe keyboard/movement inputs from player to smileysmp
      clientSocket.onmessage = (event) => {
        if (serverSocket.readyState === WebSocket.OPEN) {
          serverSocket.send(event.data);
        }
      };

      // 5. Tie the connection life cycles together if one drops
      serverSocket.onclose = () => clientSocket.close();
      clientSocket.onclose = () => serverSocket.close();
      serverSocket.onerror = () => clientSocket.close();
      clientSocket.onerror = () => serverSocket.close();
    };

    return response;
  }

  // Fallback for general browser requests and server listings
  return fetch("https://eagler.host", req);
});
