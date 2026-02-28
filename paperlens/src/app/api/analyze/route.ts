import { PDFParse } from "pdf-parse";
import { openrouter, MODELS } from "@/lib/openrouter";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    let paperText = "";
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // PDF upload
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return Response.json({ error: "No file provided" }, { status: 400 });
      }
      const buffer = new Uint8Array(await file.arrayBuffer());
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      paperText = result.text;
      await parser.destroy();
    } else {
      // JSON body: text or url
      const body = await req.json();
      if (body.text) {
        paperText = body.text;
      } else if (body.url) {
        // TODO: fetch paper content from DOI/URL
        paperText = `[Paper URL: ${body.url}]\n\nPlease analyze this paper. The URL fetching feature is not yet implemented — paste the paper text directly for now.`;
      } else {
        return Response.json(
          { error: "Provide a file, text, or url" },
          { status: 400 }
        );
      }
    }

    if (!paperText.trim()) {
      return Response.json(
        { error: "Could not extract text from the provided input" },
        { status: 400 }
      );
    }

    const stream = await openrouter.chat.completions.create({
      model: MODELS.ANALYSIS,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: paperText },
      ],
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("Analyze error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
