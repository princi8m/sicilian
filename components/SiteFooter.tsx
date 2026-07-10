import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";

export default function SiteFooter({ impressumEnabled = true }: { impressumEnabled?: boolean }) {
  return (
    <footer className="border-t border-rule mt-16">
      <div className="container-x py-6 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center text-[0.65rem] font-black tracking-[0.18em] uppercase text-text-muted">
        <span>© {new Date().getFullYear()} Sicilian Film Awards</span>
        <div className="flex flex-wrap items-center gap-6">
          <SocialLinks variant="icon" />
          <span className="hidden md:block w-px h-3 bg-rule" />
          <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
          {impressumEnabled && (
            <Link href="/impressum" className="hover:text-accent transition-colors">Impressum</Link>
          )}
          <Link href="/admin" className="hover:text-accent transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
