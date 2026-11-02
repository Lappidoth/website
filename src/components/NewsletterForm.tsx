"use client";

import { Honeypot } from "./Honeypot";
import { useFormSubmit } from "./useFormSubmit";

export function NewsletterForm({ id = "newsletter" }: { id?: string }) {
  const { status, onSubmit } = useFormSubmit("/api/subscribe");

  if (status.state === "success") {
    return <p role="status">{status.message}</p>;
  }

  return (
    <form onSubmit={onSubmit} style={{ width: "100%", display: "grid", justifyItems: "inherit", gap: "0.75rem" }}>
      <div className="inline-form">
        <label htmlFor={`${id}-email`} className="visually-hidden">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          required
          placeholder="Your email address"
          autoComplete="email"
        />
        <button type="submit" disabled={status.state === "loading"}>
          {status.state === "loading" ? "Joining…" : "Join"}
        </button>
      </div>
      <Honeypot />
      <p className="form-status" data-state={status.state} role="status" aria-live="polite">
        {status.state === "error" ? status.message : ""}
      </p>
    </form>
  );
}
