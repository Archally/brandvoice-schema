import path from "node:path";

export const PLANE_SUBDIRS = ["market", "strategy", "activation", "governance"];

export function nestedSubKey(plane, fileName) {
  const n = fileName.toLowerCase();
  const stem = path.parse(fileName).name.toLowerCase();

  if (plane === "strategy") {
    if (/\.market-product\.|^market-product\./i.test(n) || stem.startsWith("market-product")) return "market_product";
    if (/\.messaging\.|\.messages\.|^messaging\.|^messages\./i.test(n) || stem.startsWith("messaging") || stem.startsWith("messages")) return "messaging";
    if (/\.brand-core\.|^brand-core\./i.test(n) || stem.startsWith("brand-core")) return "brand_core";
    if (/\.visual-identity\.|^visual-identity\./i.test(n) || stem.startsWith("visual-identity")) return "visual_identity";
    if (/\.capacity-priorities\.|^capacity-priorities\./i.test(n) || stem.startsWith("capacity-priorities")) return "capacity_priorities";
    return null;
  }
  if (plane === "governance") {
    if (/\.evidence\.|^evidence\./i.test(n) || stem.startsWith("evidence") || stem.startsWith("research-evidence")) return "evidence";
    if (stem.startsWith("measurement")) return "measurement";
    if (stem.startsWith("decisions")) return "decisions";
    if (stem.startsWith("experiments")) return "experiments";
    return null;
  }
  if (plane === "market") {
    if (stem.startsWith("landscape") || stem === "landscape") return "landscape";
    if (stem.startsWith("competition") || stem.startsWith("substitutes") || stem === "substitutes") return "competition";
    if (stem.startsWith("opportunities") || stem.startsWith("cross-domain")) return "opportunities";
    if (stem.startsWith("ecosystem") || stem === "ecosystem") return "ecosystem";
    return null;
  }
  if (plane === "activation") {
    if (stem.startsWith("channels")) return "channels";
    if (stem.startsWith("campaigns") || stem.startsWith("content")) return "campaigns";
    return null;
  }
  return null;
}
