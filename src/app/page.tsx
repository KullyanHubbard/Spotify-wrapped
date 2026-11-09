import { Suspense } from "react";
import LoginError from "@/components/LoginError";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-5xl font-black leading-tight">
        Wraped<span className="text-[#1DB954]">.</span>
      </h1>
      <p className="text-lg opacity-80">
        Lihat top artis, lagu, dan kebiasaan dengerin musik kamu, lalu share ke Instagram Story.
      </p>
      <Suspense>
        <LoginError />
      </Suspense>
      <a href="/api/auth/login" className="rounded-full bg-[#1DB954] px-8 py-4 text-lg font-bold text-black">
        Login dengan Spotify
      </a>
      <p className="text-xs opacity-50">Kami cuma minta izin baca top items dan riwayat putar terakhir.</p>
    </main>
  );
}
