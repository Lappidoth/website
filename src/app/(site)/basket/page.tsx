import type { Metadata } from "next";
import { BasketView } from "@/components/BasketView";

export const metadata: Metadata = { title: "Your Basket", robots: { index: false } };

export default function BasketPage() {
  return (
    <>
      <section className="page-hero container">
        <h1>Your Basket</h1>
      </section>
      <div className="container">
        <BasketView />
      </div>
    </>
  );
}
