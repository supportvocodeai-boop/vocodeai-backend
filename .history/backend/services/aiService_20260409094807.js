import axios from "axios";

export async function askAI({ message, history }) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are VocodeAI.

IMPORTANT:
Always return STRICT JSON.

Actions:
1. create_file
2. write_file
3. run_code
4. terminal
5. chat

Examples:

Create file:
{
 "action":"create_file",
 "path":"main.py",
 "content":"print('Hello World')"
}

Run:
{
 "action":"run_code",
 "command":"python main.py"
}

Terminal:
{
 "action":"terminal",
 "command":"npm install"
}
`,
        },
        ...history,
        { role: "user", content: message },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].message.content;
}