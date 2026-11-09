import Link from "next/link";

export default function Masthead() {
  return (
    <header className="w-full border-b-2 border-sec/30 py-5 sm:py-6">
      <Link href="/" className="group inline-block">
        <span className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider text-sec transition-colors group-hover:text-red">
          WRAPPED<span className="text-red">.</span>
        </span>
      </Link>
    </header>
  );
}
