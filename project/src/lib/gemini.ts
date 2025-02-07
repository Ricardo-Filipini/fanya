const GEMINI_API_KEY = "AIzaSyA00Ju6qKzSf13kUkUgQvACejXVmIPOcos";
const MODEL = "gemini-pro";

export async function geminiCompletion(messages: any[]) {
  try {
    // Converte o histórico de mensagens para o formato do Gemini
    const lastMessage = messages[messages.length - 1].content;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: lastMessage
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error('Falha na requisição da API');
    }

    const data = await response.json();
    return {
      choices: [{
        message: {
          content: data.candidates[0].content.parts[0].text
        }
      }]
    };
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}