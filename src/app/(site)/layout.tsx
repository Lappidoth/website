import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="announce">Complimentary shipping on orders over $75</div>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
