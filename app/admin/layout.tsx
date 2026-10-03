// Every /admin route (login included) renders inside the shared admin palette defined in
// globals.css (.admin-theme) — the same on every festival site, independent of the public
// theme's colors.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-theme min-h-screen bg-ink text-text-primary">{children}</div>;
}
