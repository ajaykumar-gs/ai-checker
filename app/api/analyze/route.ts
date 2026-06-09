import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/detection/providers";

export const runtime = "nodejs";

interface RequestBody {
  text: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: RequestBody;

  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { text } = body;

  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "Field 'text' must be a non-empty string." }, { status: 400 });
  }

  if (text.length > 50_000) {
    return NextResponse.json(
      { error: "Text exceeds maximum length of 50,000 characters." },
      { status: 413 }
    );
  }

  try {
    const provider = getProvider();
    const result = await provider.analyze(text);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error during analysis.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
