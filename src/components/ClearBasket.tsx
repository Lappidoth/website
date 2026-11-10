"use client";

import { useEffect } from "react";
import { basket } from "./basket-store";

export function ClearBasket() {
  useEffect(() => {
    basket.clear();
  }, []);
  return null;
}
