import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieBanner from "@/components/CookieBanner";
import PartnerLogos from "@/components/PartnerLogos";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [navRows, logoRows] = await Promise.all([
    prisma.siteSetting.findMany({ where: { key: { startsWith: "nav_" } } }),
    prisma.siteSetting.findMany({ where: { key: { in: ["logo_path", "logo_height"] } } }),
  ]);
  const navEnabled = Object.fromEntries(navRows.map((r) => [r.key.replace("nav_", ""), r.value === "1"]));
  const logoSettings = Object.fromEntries(logoRows.map((r) => [r.key, r.value]));

  return (
    <>
      <SiteHeader
        navEnabled={navEnabled}
        logoPath={logoSettings.logo_path || "/uploads/trinacria-logo.png"}
        logoHeight={parseInt(logoSettings.logo_height || "32", 10)}
      />
      <main className="flex-1">{children}</main>
      <PartnerLogos />
      <SiteFooter impressumEnabled={navEnabled.impressum !== false} />
      <CookieBanner />
    </>
  );
}
