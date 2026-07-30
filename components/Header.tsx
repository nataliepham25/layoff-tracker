"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/stats", label: "Stats" },
  { href: "/submit", label: "Submit a tip" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="h-[3px] bg-text-accent" />
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-3 py-4 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="whitespace-nowrap font-serif text-lg font-medium tracking-tight sm:text-xl"
        >
          Layoff Tracker
        </Link>
        <nav className="flex items-center gap-2.5 whitespace-nowrap text-[11px] uppercase tracking-wide text-text-secondary sm:gap-6 sm:text-[13px]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "border-b-[1.5px] border-text-accent pb-0.5 font-medium text-text-primary"
                    : "border-b-[1.5px] border-transparent pb-0.5 transition-colors hover:text-text-primary"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
