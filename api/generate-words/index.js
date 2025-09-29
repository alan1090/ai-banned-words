export default async function handler(req, res) {
  console.log('[API] Request received');
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    console.log('[API] Prompt received');

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const API_KEY = process.env.DEEPSEEK_API_KEY;
    console.log('[API] API Key configured:', !!API_KEY);

    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('[API] Calling DeepSeek API...');
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{
          role: "system",
          content: "You generate Taboo game words. Respond with valid JSON containing 'guess' and 'taboo' fields. Always return exactly 5 taboo words."
        }, {
          role: "user",
          content: prompt
        }],
        response_format: { type: "json_object" },
        max_tokens: 300,
        temperature: 0.7
      }),
    });

    console.log('[API] DeepSeek response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] DeepSeek error:', errorText);
      return res.status(502).json({ 
        error: 'API request failed',
        status: response.status
      });
    }

    const data = await response.json();
    console.log('[API] Success, returning data');
    return res.status(200).json(data);

  } catch (error) {
    console.error('[API] Server Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}