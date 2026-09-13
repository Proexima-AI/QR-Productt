import { httpServerHandler } from 'cloudflare:node';
import app from './index.js';
import db from './db.js';

app.listen(3000);

const httpHandler = httpServerHandler({ port: 3000 });

export default {
  async fetch(request, env, ctx) {
    db.setHyperdrive(env.HYPERDRIVE);
    return httpHandler.fetch(request, env, ctx);
  },

  async scheduled(controller, env, ctx) {
    db.setHyperdrive(env.HYPERDRIVE);
    await app.runAutoReplyJob();
  }
};