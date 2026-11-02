"use client";

import { Honeypot } from "./Honeypot";
import { useFormSubmit } from "./useFormSubmit";

export function ContactForm() {
  const { status, onSubmit } = useFormSubmit("/api/contact");

  if (status.state === "success") {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <p className="script" style={{ fontSize: "3.5rem" }}>
          Thank you
        </p>
        <p role="status">{status.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="form-grid">
      <div className="field">
        <label htmlFor="c-first">First name</label>
        <input id="c-first" name="firstName" required autoComplete="given-name" />
      </div>
      <div className="field">
        <label htmlFor="c-last">Last name</label>
        <input id="c-last" name="lastName" autoComplete="family-name" />
      </div>
      <div className="field">
        <label htmlFor="c-email">Email</label>
        <input id="c-email" type="email" name="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="c-phone">Phone (optional)</label>
        <input id="c-phone" type="tel" name="phone" autoComplete="tel" />
      </div>
      <div className="field full">
        <label htmlFor="c-subject">Subject</label>
        <select id="c-subject" name="subject" defaultValue="General enquiry">
          <option>General enquiry</option>
          <option>Order support</option>
          <option>Wholesale &amp; stockists</option>
          <option>Gifting &amp; events</option>
          <option>Press</option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" required />
      </div>
      <label className="checkbox full">
        <input type="checkbox" name="marketingOptIn" />
        <span>Keep me in the circle — new releases, rituals and early access.</span>
      </label>
      <Honeypot />
      <div className="full" style={{ display: "grid", gap: "1rem", justifyItems: "start" }}>
        <button className="btn btn-solid" type="submit" disabled={status.state === "loading"}>
          {status.state === "loading" ? "Sending…" : "Send message"}
        </button>
        <p className="form-status" data-state={status.state} role="status" aria-live="polite">
          {status.state === "error" ? status.message : ""}
        </p>
      </div>
    </form>
  );
}
