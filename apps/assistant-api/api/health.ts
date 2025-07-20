import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({ 
    status: 'healthy',
    service: 'studyspot-assistant-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}