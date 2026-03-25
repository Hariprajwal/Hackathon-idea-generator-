import { NextResponse } from 'next/server';

const API_URL = 'https://api.cerebras.ai/v1/chat/completions';
const API_KEY = process.env.CEREBRAS_API_KEY;

export async function POST(request) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const { problem, focus, creativity } = await request.json();

  const HACKATHON_PROMPT = `HACKATHON DOMINATION ENGINE – DESIGN ROUND MASTER MODE

ROLE ASSUMPTION:
You are an elite hackathon strategist, system architect, product thinker, and judge-level evaluator combined into one.

[... full prompt from earlier ...]

PROBLEM STATEMENT: ` + (focus || 'general users') + ' ' + problem;

  const aiResponse = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama3.1-8b',
      messages: [
        { role: 'system', content: HACKATHON_PROMPT },
        { role: 'user', content: problem }
      ],
      max_tokens: 4096,
      temperature: creativity || 0.3,
      top_p: 1,
      stream: false
    })
  });

  if (!aiResponse.ok) {
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }

  const data = await aiResponse.json();
  const content = data.choices[0].message.content;

  return NextResponse.json({ content });
}
