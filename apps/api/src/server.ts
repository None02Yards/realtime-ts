import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app';
import { env } from './config/env';
import { connectMongo } from './config/mongo';
import { registerSockets } from './sockets';

async function main() {
  await connectMongo();

  const app = createApp();
  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: { origin: env.webOrigin, credentials: true },
  });

  registerSockets(io);

  httpServer.listen(env.port, () => {
    console.log(`[api] listening on http://localhost:${env.port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
