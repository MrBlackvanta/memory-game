import { Logo } from "@/components/icons";
import { SITE_NAME } from "@/data";

export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center">
      <h1>
        <span className="sr-only">{SITE_NAME}</span>
        <Logo className="text-ink" />
      </h1>
    </main>
  );
}
