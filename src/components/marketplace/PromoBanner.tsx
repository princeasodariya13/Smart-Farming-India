import Image from "next/image";

export default function PromoBanner() {
  return (
    <section
      aria-label="Government subsidy promotion"
      className="relative mt-12 flex flex-col items-center gap-8 overflow-hidden rounded-[32px] border border-white/40 bg-secondary-container p-8 shadow-inner md:flex-row md:p-12"
    >
      {/* Glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/20 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-10 h-60 w-60 rounded-full bg-primary/10 blur-[80px]"
      />

      {/* Text */}
      <div className="relative z-10 flex-1">
        <h2 className="mb-4 font-headline-lg text-headline-lg text-on-secondary-container">
          Upgrade Your Farming with
          <br />
          Government Subsidies
        </h2>
        <p className="mb-8 max-w-lg text-body-lg text-on-secondary-container/80">
          Get up to 40% off on premium equipment through the Smart Farming India portal. Check
          your eligibility today.
        </p>
        <button
          type="button"
          className="rounded-2xl bg-on-secondary-container px-8 py-4 text-lg font-bold text-on-primary-container shadow-xl shadow-black/10 transition-transform hover:scale-105"
        >
          View Eligible Schemes
        </button>
      </div>

      {/* Image */}
      <div className="relative z-10 aspect-square w-full overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl md:w-1/3">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqfcePgqPZI8WTt2MMPPE7yMCoVXA0Khk5sldtXVyrR9JyCsa8uwNxNNq--fvQEnN7SsMhXnkyhgcmtM61rf20JogZQ5VE2U7ogCP_fiBF5iPUA_qlrESwc4sHtBkz95ytL6x4Bdl75DaB_97q7XGm7dMEXTcRcNPBMJf7IzqVcKZARx9o3eJ9VKjNd5Ai3kr4lLH03B1A_-3KwlPEex-jtFk2MwtGwLitHV-bLnHLMWlJws27RFnP-hWb6u9A8crXbpnLzJmC1w"
          alt="Tablet displaying government agricultural portal in front of green rice paddies"
          fill
          className="object-cover"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
    </section>
  );
}
