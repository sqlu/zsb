const aiRequest = async (system: string, msg: string, aiLastMsg?: string) => {
  const headers = {
    Authorization: `Bearer ${process.env.AI_API_TOKEN}`,
    "Content-Type": "application/json",
  };

  const AllMessages = aiLastMsg
    ? [
        {
          role: "system",
          content: system,
        },
        {
          role: "assistant",
          content: aiLastMsg,
        },
        {
          role: "user",
          content: msg,
        },
      ]
    : [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: msg,
        },
      ];

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "google/gemma-2-9b-it:free",
        messages: AllMessages,
        top_p: 1,
        temperature: 1,
        repetition_penalty: 1,
      }),
    }
  );

  let responseMsg;
  try {
    const awaitResponse = await response.json();
    responseMsg = awaitResponse.choices[0].message.content;
  } catch {
    responseMsg = null;
  }

  return responseMsg;
};

export { aiRequest };
