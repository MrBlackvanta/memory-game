import { SITE_NAME } from "@/data";
import type { Metadata } from "next";
import Link from "next/link";

const description = "There’s no game at this address.";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Page not found`,
  description,
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main
      data-theme="dark"
      className="flex min-h-dvh flex-col items-center justify-center p-6"
    >
      <p className="text-logo text-paper md:text-logo-md">{SITE_NAME}</p>
      <div className="mt-11.25 w-full max-w-163.5 rounded-card bg-paper p-6 text-center md:mt-19.5 md:rounded-panel md:p-14">
        <h1 className="text-title text-ink md:text-title-md">Page not found</h1>
        <p className="mt-2.25 text-subtitle text-balance text-muted md:mt-4 md:text-subtitle-md">
          {description}
        </p>
        <Link
          href="/"
          className="mt-6 flex h-12 items-center justify-center rounded-full bg-accent text-cta text-navy hover:bg-accent-hover motion-safe:transition-colors md:mt-10 md:h-17.5 md:text-cta-md"
        >
          Set Up New Game
        </Link>
      </div>
    </main>
  );
}
