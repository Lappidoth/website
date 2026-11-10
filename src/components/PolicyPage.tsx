export function PolicyPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Last updated {updated}</p>
        <h1>{title}</h1>
      </section>
      <section className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="prose">
          <p className="draft-note">
            Draft template — please review (ideally with a legal adviser) and confirm the details before launch.
          </p>
          {children}
        </div>
      </section>
    </>
  );
}
