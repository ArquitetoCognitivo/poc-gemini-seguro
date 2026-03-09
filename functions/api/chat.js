
export async function onRequest(context) {
  return new Response(
    JSON.stringify({ answer: "API OK" }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}


/*export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "method_not_allowed" }),
      { status: 405 }
    );
  }

  const apiKey = env.GEMINI_API_KEY;
  const b64 = env.SYSTEM_PROMPT_B64;

  const systemPrompt = atob(b64).trim();

  const body = await request.json();
  const userText = (body?.text || "").trim();

  const enhancedUserText = `
Você está operando como um Executive Strategic Advisor de alto nível.

Pergunta do usuário:
${userText}
`;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: enhancedUserText }]
        }
      ]
    })
  });

  const data = await response.json();

  const answer =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "sem_resposta";

  return new Response(
    JSON.stringify({ answer }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}
*/
