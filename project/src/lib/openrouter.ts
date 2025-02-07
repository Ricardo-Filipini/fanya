const OPENROUTER_API_KEY = "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";
const MODEL = "deepseek/deepseek-r1:free";

export async function chatCompletion(messages: any[]) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}