"use client";

import { useState } from "react";

type Status = { state: "idle" | "loading" | "success" | "error"; message?: string };

/** Posts a form's fields as JSON to one of the /api endpoints. */
export function useFormSubmit(endpoint: string, extra?: Record<string, unknown>) {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Record<string, unknown> = { ...extra };
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string" && value.trim() !== "") data[key] = value;
    });
    form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((cb) => {
      data[cb.name] = cb.checked;
    });

    setStatus({ state: "loading" });
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus({ state: "error", message: json.error ?? "Something went wrong." });
        return;
      }
      form.reset();
      setStatus({ state: "success", message: json.message });
    } catch {
      setStatus({ state: "error", message: "Network error — please try again." });
    }
  }

  return { status, onSubmit };
}
