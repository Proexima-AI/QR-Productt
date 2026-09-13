import { httpServerHandler } from 'cloudflare:node';
import app from './index.js';
import db from './db.js';

app.listen(3000);

const httpHandler = httpServerHandler({ port: 3000 });

function populateEnv(env) {
  db.setHyperdrive(env.HYPERDRIVE);
  // Bridge Cloudflare Worker secrets → process.env for index.js
  const keys = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'GOOGLE_API_KEY', 'JWT_SECRET', 'OPENAI_API_KEY', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'];
  for (const key of keys) {
    if (env[key]) process.env[key] = env[key];
  }
}

export default {
  async fetch(request, env, ctx) {
    populateEnv(env);
    return httpHandler.fetch(request, env, ctx);
  },

  async scheduled(controller, env, ctx) {
    populateEnv(env);
    await app.runAutoReplyJob();
  }
};