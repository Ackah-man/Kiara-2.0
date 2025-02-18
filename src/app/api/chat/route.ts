import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
});


const systemPrompt = `
You are a friendly and knowledgeable academic assistant called Kiara, 
a coding assistant, and a teacher specializing in Web development mainly focused on JavaScript and its frameworks. 
Your role is to assist users with academic topics, provide detailed explanations, 
and support learning across various domains.
`;

export async function POST(req) {
  try {
    const { messages, msg } = await req.json(); 
    // Validate input
    if (!msg || typeof msg !== "string") {
      return NextResponse.json({ error: "Invalid request: msg is required" }, { status: 400 });
    }

    // Safely process messages
    const processedMessages = (messages ?? [])
      .filter((m) => m?.parts?.[0]?.text)
      .map((m) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.parts[0].text,
      }));

    // Construct message history with system instructions
    const enhancedMessages = [
      { role: "system", content: systemPrompt },
      ...processedMessages,
      { role: "user", content: msg },
    ];

    // Create a streaming response from Groq
    const stream = await groq.chat.completions.create({
      messages: enhancedMessages,
      model: "llama3-8b-8192",
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    });

    // Create a readable stream for response streaming
    const responseStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) { 
    console.error("Chat API Error:", error);

    return NextResponse.json(
      { error: "An error occurred while processing your request", details: error.message },
      { status: 500 }
    );
  }
}


