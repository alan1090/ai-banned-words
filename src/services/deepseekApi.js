const callDeepSeek = async (prompt) => {
  const API_KEY = process.env.DEEPSEEK_API_KEY;

  if (!API_KEY) {
    throw new Error("API key not configured. Please check your environment variables.");
  }

  try {
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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error("Network error: Unable to connect to API. Please check your internet connection.");
    }
    
    throw new Error(error.message || "Service unavailable, please try again later");
  }
};

export default callDeepSeek;