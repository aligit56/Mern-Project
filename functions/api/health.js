import { handleError, json } from '../_utils.js'

export async function onRequestGet({ env }) {
  try {
    await env.DB.prepare('SELECT 1').first()
    return json({ status: 'ok', storage: 'cloudflare-d1' })
  } catch (error) {
    return handleError(error)
  }
}
