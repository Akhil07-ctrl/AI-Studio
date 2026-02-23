// Webhook configuration for different AI Studio features
export const WEBHOOKS = {
  'social-media': {
    url: 'https://workflow.ccbp.in/webhook-test/effd5adb-e750-4d4b-8fc9-03def3e32aa8',
    description: 'Social Media Post Generator'
  },
  'podcast': {
    url: 'https://workflow.ccbp.in/webhook-test/aea3b229-b06c-454d-9b8c-4ecfd18c899f',
    description: 'Podcast Generator'
  },
  'thumbnail': {
    url: 'https://workflow.ccbp.in/webhook-test/b0415874-6381-4d46-8a31-015828436686',
    description: 'Thumbnail Generator'
  }
};

export const getWebhookUrl = (webhookType) => {
  const webhook = WEBHOOKS[webhookType];
  if (!webhook) {
    throw new Error(`Invalid webhook type: ${webhookType}`);
  }
  return webhook.url;
};
