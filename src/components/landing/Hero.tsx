import Link from "next/link";
import Image from "next/image";
import { Users, Brain, Landmark, ArrowRight, CheckCircle } from "lucide-react";

const STATS = [
  { icon: Users, value: "2.4M+", label: "Registered Farmers" },
  { icon: Brain, value: "98.5%", label: "AI Accuracy" },
  { icon: Landmark, value: "120+", label: "Active Schemes" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-white px-6 pt-10 pb-20 md:px-16 md:pt-14 md:pb-28 shadow-xl shadow-slate-200/40 ring-1 ring-slate-200/50 w-full">
      {/* Subtle Hero Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/login-bg.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover opacity-[0.03] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-slate-50" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 md:flex-row">
        <div className="flex-1 text-center md:text-left">
          <span className="mb-6 inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-800 border border-green-200">
            Transforming Indian Agriculture
          </span>

          <h1 className="mb-6 text-balance text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-6xl tracking-tight">
            Empowering Every Farmer <span className="italic text-green-600">with AI</span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base text-slate-600 md:mx-0 md:text-lg leading-relaxed">
            India&apos;s complete digital farming ecosystem. AI-driven insights, marketplace
            access, and government integration in one premium platform.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-green-700 to-green-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-green-600/20 transition-transform hover:scale-105"
            >
              Get started
              <ArrowRight size={20} />
            </Link>
            <Link
              href="#analytics"
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Explore platform
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <stat.icon size={24} />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs font-semibold text-slate-500">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-xl flex-1">
          <div className="group relative">
            <div className="absolute -inset-4 rounded-[32px] bg-green-500/10 blur-2xl transition-all group-hover:bg-green-500/20" />
            <div className="relative w-full aspect-video min-h-[250px] overflow-hidden rounded-3xl border border-slate-200 shadow-2xl md:aspect-square md:min-h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80"
                alt="Aerial view of a modern Indian farm at dawn with an agricultural drone flying over neat crop rows"
                fill
                priority
                sizes="(min-width: 768px) 576px, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 hidden animate-bounce rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md p-4 shadow-xl lg:block">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-green-600" />
                <span className="text-sm font-bold text-slate-800">Soil health optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
