const callDeepSeek = async (prompt) => {
  try {
    const response = await fetch('/api/generate-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed: ${response.status}`);
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