import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const ADMIN_EMAIL = "rebecca.leung671@gmail.com";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { title, topic } = await req.json();
  if (!title && !topic) {
    return new Response(JSON.stringify({ error: "Missing title or topic" }), {
      status: 400,
    });
  }

  const client = new Anthropic();
  const subject = title || topic;

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Write a detailed, SEO-optimized blog post for Barnbook — a horse barn directory website. The post should target horse owners, equestrians, boarders, and riding students.

Title: "${subject}"

Requirements:
- Write in a warm, knowledgeable, editorial voice (think Town & Country meets practical horse guide)
- 800–1200 words
- Include a compelling intro paragraph
- Use clear H2 subheadings (## Heading) to organize sections
- Include practical tips, local insights, and cost ranges where relevant
- End with a helpful conclusion and a subtle call-to-action to search Barnbook
- Format as clean HTML with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags
- Do NOT include <html>, <head>, <body>, or <article> wrapper tags
- Just the inner content HTML starting directly with the first element`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
