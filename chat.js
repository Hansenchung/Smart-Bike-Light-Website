const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'The AI service is not configured.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }
  }

  const message = body && typeof body.message === 'string'
    ? body.message.trim()
    : '';

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: 'You are the SignalRide product assistant. Answer questions about SignalRide clearly and concisely. SignalRide is a smart bicycle rear light using ESP32-C3 controllers and IMU-based automatic turn-signal deactivation. Do not invent specifications that are not provided.'
          },
          { role: 'user', content: message }
        ]
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      return res.status(502).json({ error: 'The AI service returned an unreadable response.' });
    }

    if (!response.ok) {
      console.error('OpenAI request failed:', data);

      if (response.status === 401 || response.status === 403) {
        return res.status(502).json({ error: 'The AI provider rejected the request. Check the OpenAI API key and permissions.' });
      }

      return res.status(502).json({ error: 'The AI service could not process the request.' });
    }

    const reply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : '';

    if (typeof reply !== 'string' || !reply.trim()) {
      return res.status(502).json({ error: 'The AI service returned an empty response.' });
    }

    return res.status(200).json({ reply: reply.trim() });
  } catch (error) {
    console.error('AI request error:', error);
    return res.status(502).json({ error: 'Sorry, I cannot reach the AI service right now.' });
  }
};
