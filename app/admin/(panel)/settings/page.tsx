import { prisma } from "@/lib/prisma";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

const inp = "w-full bg-panel border border-white/10 px-3 py-2 text-sm";

const NAV_ITEMS = [
  { key: "submissions", label: "Submit" },
  { key: "winners",     label: "Winners" },
  { key: "reviews",     label: "Film Reviews" },
  { key: "events",      label: "Events" },
  { key: "photos",      label: "Photos" },
  { key: "dates",       label: "Dates" },
  { key: "shop",        label: "Shop" },
  { key: "contact",     label: "Contact" },
  { key: "impressum",   label: "Impressum" },
];

export default async function SettingsPage() {
  const rows = await prisma.siteSetting.findMany();
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div className="max-w-lg space-y-10">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Email */}
      <form action={saveSettings} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest border-b border-rule pb-2">
            Email notifications
          </h2>
          <label className="block">
            <span className="text-xs text-white/60 uppercase tracking-wide">Notification email</span>
            <input
              name="notification_email"
              type="email"
              defaultValue={s.notification_email || ""}
              placeholder="info@sicilianfilmawards.com"
              className={inp + " mt-1"}
            />
            <p className="text-xs text-white/30 mt-1">
              Contact form submissions and review requests will be sent here.
            </p>
          </label>
        </section>

        {/* Nav toggles */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest border-b border-rule pb-2">
            Navigation — visible pages
          </h2>
          <p className="text-xs text-white/30">Uncheck to hide a page from the public menu.</p>
          <div className="grid grid-cols-2 gap-3">
            {NAV_ITEMS.map((item) => {
              const enabled = s[`nav_${item.key}`] !== "0";
              return (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name={`nav_${item.key}`}
                    defaultChecked={enabled}
                    className="w-4 h-4 accent-[#c9a84c]"
                  />
                  <span className="text-sm group-hover:text-accent transition-colors">{item.label}</span>
                </label>
              );
            })}
          </div>
        </section>

        <button
          type="submit"
          className="bg-wine-red text-white px-5 py-2 text-sm font-black uppercase tracking-widest hover:bg-wine-red/80 transition-colors"
        >
          Save
        </button>
      </form>
    </div>
  );
}
