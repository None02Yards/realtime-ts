
// // apps\api\src\sockets\index.ts
// import { Server } from 'socket.io';
// import { createAdapter } from '@socket.io/redis-adapter';
// import { pub, sub } from '../config/redis';
// import { registerChatGateway } from './chat.gateway';

// export function registerSockets(io: Server) {
//   io.adapter(createAdapter(pub, sub));
//   registerChatGateway(io);
// }

import { Server } from 'socket.io';
import { registerChatGateway } from './chat.gateway';

// Redis adapter disabled in dev (no Redis running)
export function registerSockets(io: Server) {
  //  enable Redis:
  // import { createAdapter } from '@socket.io/redis-adapter';
  // import { pub, sub } from '../config/redis';
  // io.adapter(createAdapter(pub, sub));

  registerChatGateway(io);
}
