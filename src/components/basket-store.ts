"use client";

import { useSyncExternalStore } from "react";

export type BasketLine = {
  key: string; // slug + selections, so identical items merge
  slug: string;
  name: string;
  image: string;
  priceCents: number; // display only — the server re-prices at checkout
  quantity: number;
  selections?: string[];
  optionLabel?: string;
};

type State = { lines: BasketLine[]; open: boolean };

const STORAGE_KEY = "lc-basket-v1";
const EMPTY: State = { lines: [], open: false };
let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { lines: JSON.parse(raw), open: false };
  } catch {
    /* storage unavailable — basket just won't persist */
  }
}

function set(next: State) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.lines));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export const basket = {
  add(line: Omit<BasketLine, "key" | "quantity">, quantity = 1) {
    load();
    const key = [line.slug, ...(line.selections ?? [])].join("|");
    const existing = state.lines.find((l) => l.key === key);
    const lines = existing
      ? state.lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(20, l.quantity + quantity) } : l))
      : [...state.lines, { ...line, key, quantity }];
    set({ lines, open: true });
  },
  setQuantity(key: string, quantity: number) {
    load();
    const lines =
      quantity <= 0
        ? state.lines.filter((l) => l.key !== key)
        : state.lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(20, quantity) } : l));
    set({ ...state, lines });
  },
  clear() {
    load();
    set({ lines: [], open: false });
  },
  setOpen(open: boolean) {
    load();
    state = { ...state, open };
    listeners.forEach((l) => l());
  },
};

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useBasket() {
  const s = useSyncExternalStore(subscribe, () => (load(), state), () => EMPTY);
  const count = s.lines.reduce((n, l) => n + l.quantity, 0);
  const subtotalCents = s.lines.reduce((n, l) => n + l.priceCents * l.quantity, 0);
  return { ...s, count, subtotalCents };
}
