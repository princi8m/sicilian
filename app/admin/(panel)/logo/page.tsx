import { prisma } from "@/lib/prisma";
import { saveLogo } from "./actions";
import HeightSlider from "./HeightSlider";
import LogoPreview from "./LogoPreview";
import SubmitButton from "@/components/admin/SubmitButton";
export const dynamic = "force-dynamic";

export default async function LogoPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["logo_path", "logo_height"] } },
  });
  const s = Object.fromEntries(settings.map((r) => [r.key, r.value]));
  const logoPath   = s.logo_path   ?? "/uploads/trinacria-logo.png";
  const logoHeight = parseInt(s.logo_height ?? "32", 10);

  return (
    <div className="max-w-lg space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-1">Site Logo</h1>
        <p className="text-sm text-white/50">
          Upload a new logo image. PNG with transparent background recommended.
        </p>
      </div>

      <div className="bg-panel border border-white/10 p-6">
        <LogoPreview src={logoPath} height={logoHeight} />
      </div>

      <form action={saveLogo} encType="multipart/form-data" className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-widest text-white/60">
            Replace logo
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            className="block w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:border file:border-white/20 file:bg-white/5 file:text-white file:text-xs file:font-black file:uppercase file:tracking-widest hover:file:bg-white/10 file:cursor-pointer"
          />
          <p className="text-xs text-white/30">PNG with transparent background recommended.</p>
        </div>

        <HeightSlider defaultValue={logoHeight} />

        <SubmitButton className="px-6 py-2.5 bg-wine-red text-white text-xs font-black uppercase tracking-widest hover:bg-wine-red/80">
          Save
        </SubmitButton>
      </form>
    </div>
  );
}
