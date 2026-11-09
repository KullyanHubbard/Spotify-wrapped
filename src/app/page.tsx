import { Suspense } from "react";
import LoginError from "@/components/LoginError";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-6">
      <header className="flex justify-between border-b-2 border-ink pb-3 font-mono text-xs uppercase">
        <span className="font-bold">Wraped®</span>
        <span>Spotify Stats</span>
      </header>

      <h1 className="mt-10 text-[22vw] font-black uppercase leading-[0.8] tracking-[-0.035em] sm:text-[8.5rem]">
        Musik
        <br />
        kamu<span className="text-signal">.</span>
      </h1>

      <div className="mt-8 grid grid-cols-[auto_1fr] border-2 border-ink">
        {["Top artis & lagu", "Album favorit", "Jam dengar", "Export 9:16 ke Story"].map((item, i) => (
          <div key={item} className="contents">
            <span className={`border-r-2 border-ink px-3 py-2 font-mono text-sm ${i ? "border-t-2" : ""}`}>0{i + 1}</span>
            <span className={`px-3 py-2 font-bold uppercase ${i ? "border-t-2 border-ink" : ""}`}>{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-10">
        <Suspense>
          <LoginError />
        </Suspense>
        <a href="/api/auth/login" className="brut flex items-center justify-between bg-acid px-5 py-4 text-lg font-black uppercase">
          Login dengan Spotify <span>→</span>
        </a>
        <p className="font-mono text-[11px] uppercase">Izin yang diminta: top items + riwayat putar terakhir. Read-only.</p>
      </div>
    </main>
  );
}
