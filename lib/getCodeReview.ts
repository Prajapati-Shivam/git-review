const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const systemPrompt = `
You are a senior software engineer and AI code reviewer.
Your job is to analyze code and give helpful, concise feedback — including identifying potential bugs, suggesting best practices, and recommending improvements.
`;

/**
 * Generates code review feedback using the Gemini API.
 * @param code - The code snippet to review.
 * @returns A promise resolving to code review suggestions.
 */
export default async function getCodeReview(code: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\nHere is the code to review:\n\n${code}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return result;
  } catch (error) {
    console.error('Error generating code review:', error);
    return 'Sorry, we could not generate a code review at this moment. Please try again later.';
  }
}
