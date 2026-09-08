import { Resend } from 'resend';

let client: Resend | null = null;

/**
 * Lazy singleton so builds without RESEND_API_KEY (CI, local without env)
 * don't crash at import time — the key is only required once a request
 * actually tries to send.
 */
export function getResendClient() {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }
    client = new Resend(apiKey);
  }
  return client;
}
