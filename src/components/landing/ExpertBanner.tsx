import Link from "next/link";
import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

export default function ExpertBanner() {
  return (
    <section id="community" className="w-full">
      <RevealOnScroll className="relative flex w-full flex-col items-center justify-between gap-8 overflow-hidden rounded-[2.5rem] bg-green-900 p-8 text-center md:flex-row md:p-16 md:text-left shadow-2xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-bg.png"
            alt="Farm landscape"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-800/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-xl">
          <h2 className="mb-4 text-3xl font-extrabold text-white md:text-4xl tracking-tight">
            Need personalized advice?
          </h2>
          <p className="text-base text-green-100 md:text-lg leading-relaxed">
            Connect with certified agronomists for 1-on-1 video consultations and tailored farm
            management plans.
          </p>
        </div>
        <div className="relative z-10">
          <Link
            href="/dashboard"
            className="inline-block rounded-2xl bg-white px-10 py-5 text-lg font-bold text-green-800 shadow-xl transition-all hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-white/20"
          >
            Talk to an expert
          </Link>
        </div>
      </RevealOnScroll>
    </section>
  );
}
