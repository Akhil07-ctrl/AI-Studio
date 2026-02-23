import express from 'express';
import fetch from 'node-fetch';
import { getWebhookUrl } from '../config/webhooks.js';

const router = express.Router();

/**
 * Generic webhook proxy handler
 * Forwards requests to external webhook services
 */
async function handleWebhookProxy(webhookType, body) {
  const webhookUrl = getWebhookUrl(webhookType);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Webhook request failed: ${response.statusText} - ${errorData}`);
  }

  return await response.json();
}

/**
 * POST /api/webhook/social-media
 * Generate social media posts from URL content
 */
router.post('/social-media', async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: 'Text is required',
        message: 'Please provide a URL or content text'
      });
    }

    const data = await handleWebhookProxy('social-media', { text });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/webhook/podcast
 * Generate podcast audio from topic description
 */
router.post('/podcast', async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: 'Text is required',
        message: 'Please provide a podcast topic'
      });
    }

    const data = await handleWebhookProxy('podcast', { text });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/webhook/thumbnail
 * Generate thumbnail image from prompt
 */
router.post('/thumbnail', async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: 'Text is required',
        message: 'Please provide a thumbnail description/prompt'
      });
    }

    const data = await handleWebhookProxy('thumbnail', { text });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/webhook/health
 * Health check endpoint for webhook service
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'Webhook service is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
