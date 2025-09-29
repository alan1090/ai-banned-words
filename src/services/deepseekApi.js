const callDeepSeek = async (prompt) => {
  try {
    const response = await fetch("/api/generate-word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[DeepSeekAPI] Error:`, error);

    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      throw new Error(
        "Network error: Unable to connect to API. Please check your internet connection."
      );
    }

    throw new Error(
      error.message || "Service unavailable, please try again later"
    );
  }
};

export default callDeepSeek;
