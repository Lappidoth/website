/** Artwork taken from the official candle labels, keyed by product slug. */
import type { StaticImageData } from "next/image";
import connectCream from "../../public/brand/name-connect-cream.png";
import connectInk from "../../public/brand/name-connect-ink.png";
import involvedCream from "../../public/brand/name-involved-cream.png";
import involvedInk from "../../public/brand/name-involved-ink.png";
import soLovedCream from "../../public/brand/name-so-loved-cream.png";
import soLovedInk from "../../public/brand/name-so-loved-ink.png";

type Art = { nameInk: StaticImageData; nameCream: StaticImageData; label: string };

export const CANDLE_ART: Record<string, Art> = {
  "so-loved": { nameInk: soLovedInk, nameCream: soLovedCream, label: "/images/label-so-loved.png" },
  involved: { nameInk: involvedInk, nameCream: involvedCream, label: "/images/label-involved.png" },
  connect: { nameInk: connectInk, nameCream: connectCream, label: "/images/label-connect.png" },
};
