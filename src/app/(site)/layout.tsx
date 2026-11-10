import { BasketDrawer } from "@/components/BasketDrawer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatPrice } from "@/lib/format";
import { SHOP } from "@/lib/shop-config";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="announce">
        Complimentary UK delivery on orders over {formatPrice(SHOP.freeShippingThresholdCents)}
      </div>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <BasketDrawer />
    </>
  );
}
