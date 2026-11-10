"use client";

import Image from "next/image";
import { useState } from "react";

type Shot = { src: string; alt: string; kind: "photo" | "label" };

export function ProductGallery({ shots }: { shots: Shot[] }) {
  const [i, setI] = useState(0);
  const current = shots[i];
  return (
    <div className="gallery">
      <div className="media" data-kind={current.kind}>
        <Image src={current.src} alt={current.alt} fill priority sizes="(max-width: 860px) 100vw, 55vw" />
      </div>
      {shots.length > 1 && (
        <div className="thumbs" role="group" aria-label="Product images">
          {shots.map((s, j) => (
            <button
              key={s.src}
              type="button"
              aria-pressed={i === j}
              aria-label={s.kind === "label" ? "View the label" : "View photo"}
              onClick={() => setI(j)}
            >
              <Image src={s.src} alt="" fill sizes="76px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
