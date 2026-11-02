"use client";

import { Honeypot } from "./Honeypot";
import { useFormSubmit } from "./useFormSubmit";

export function WaitlistForm({ productSlug }: { productSlug: string }) {
  const { status, onSubmit } = useFormSubmit("/api/waitlist", { productSlug });

  if (status.state === "success") {
    return (
      <p role="status" style={{ color: "var(--ink)" }}>
        {status.message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.25rem" }}>
      <div className="field">
        <label htmlFor="wl-email">Email</label>
        <input id="wl-email" type="email" name="email" required autoComplete="email" />
      </div>
      <Honeypot />
      <button className="btn btn-solid" type="submit" disabled={status.state === "loading"}>
        {status.state === "loading" ? "Saving…" : "Notify me"}
      </button>
      <p className="form-status" data-state={status.state} role="status" aria-live="polite">
        {status.state === "error" ? status.message : ""}
      </p>
    </form>
  );
}
