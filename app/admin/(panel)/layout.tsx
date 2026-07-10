import Link from "next/link";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="border-b border-white/10">
        <div className="container-x flex items-center gap-6 h-14">
          <span className="font-semibold text-accent">Admin</span>
          <nav className="flex gap-4 text-sm">
            {adminNav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-accent">{n.label}</Link>
            ))}
          </nav>
          <form action="/admin/logout" method="post" className="ml-auto">
            <button className="text-sm text-white/60 hover:text-white">Sign out</button>
          </form>
        </div>
      </div>
      <div className="container-x py-8">{children}</div>
    </div>
  );
}
