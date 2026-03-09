export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "missing_api_key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await request.json();
    const userText = (body?.text || "").trim();

    if (!userText) {
      return new Response(JSON.stringify({ error: "missing_text" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userText }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify({
      status: response.status,
      ok: response.ok,
      data
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "internal_error",
      detail: String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
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
