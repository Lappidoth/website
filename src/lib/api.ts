import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Shared handler for public form endpoints: parses JSON, drops bots that fill
 * the hidden "company" honeypot, validates with zod, and returns friendly errors.
 */
export function formHandler<S extends z.ZodType>(
  schema: S,
  action: (data: z.infer<S>) => Promise<unknown>,
  successMessage: string,
) {
  return async (req: Request) => {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    if (typeof body.company === "string" && body.company.length > 0) {
      return NextResponse.json({ ok: true, message: successMessage });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Please check the form.";
      return NextResponse.json({ ok: false, error: first }, { status: 422 });
    }

    try {
      await action(parsed.data);
      return NextResponse.json({ ok: true, message: successMessage });
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  };
}
