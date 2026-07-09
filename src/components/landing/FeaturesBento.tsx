import Image from "next/image";
import Link from "next/link";
import { Camera, CheckCircle, CloudSun, Landmark, ArrowRight, Store } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import LiveWeather from "./LiveWeather";

const DISEASE_DETECTION_POINTS = [
  "200+ Crop varieties covered",
  "Real-time pesticide guidance",
];

const MANDI_PRICES = [
  { crop: "Cotton (GJ)", price: "₹7,250/q" },
  { crop: "Groundnut (GJ)", price: "₹6,820/q" },
  { crop: "Wheat (UP)", price: "₹2,450/q" },
];

export default function FeaturesBento() {
  return (
    <section id="analytics" className="w-full">
      <div className="w-full">
        <RevealOnScroll className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-extrabold md:text-4xl text-slate-900 tracking-tight">
            Ecosystem Intelligence
          </h2>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
            Seamlessly integrated modules designed to provide 360&deg; visibility into your
            farm&apos;s health, market dynamics, and operational efficiency.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:grid-rows-2">
          {/* Feature 1: AI Disease Detection (large) */}
          <RevealOnScroll className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow md:col-span-2 md:row-span-2">
            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <Camera size={28} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900">AI Disease Detection</h3>
              <p className="mb-8 max-w-sm text-base text-slate-600 leading-relaxed">
                Snap a photo to identify crop diseases instantly with 98.5% precision. Receive
                immediate treatment protocols and preventative measures.
              </p>
              <ul className="mb-8 space-y-4">
                {DISEASE_DETECTION_POINTS.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle size={20} className="text-green-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mt-auto h-56 min-h-[14rem] w-full shrink-0 overflow-hidden rounded-2xl border border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80"
                alt="Smartphone screen scanning a crop leaf"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </RevealOnScroll>

          {/* Feature 2: Weather Forecast */}
          <RevealOnScroll
            id="weather"
            className="flex flex-col md:flex-row items-center gap-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 hover:shadow-md transition-shadow md:col-span-2"
          >
            <div className="flex-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <CloudSun size={24} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">Hyper-local Weather</h3>
              <p className="text-base text-slate-600 leading-relaxed mb-6 md:mb-0">
                Pinpoint accurate forecasts with live AI-driven localized insights tailored for Gujarat.
              </p>
            </div>
            <LiveWeather />
          </RevealOnScroll>

          {/* Feature 3: Govt Schemes */}
          <RevealOnScroll
            id="schemes"
            className="flex flex-col justify-between rounded-3xl bg-blue-50 p-8 text-blue-900 hover:shadow-md transition-shadow md:col-span-1"
          >
            <div>
              <Landmark size={32} className="mb-4 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold">Govt. Schemes</h3>
              <p className="text-sm font-medium text-blue-800/80 leading-relaxed">
                Direct access to subsidies and DBT applications.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-700 transition-transform hover:translate-x-1"
            >
              Apply now
              <ArrowRight size={18} />
            </Link>
          </RevealOnScroll>

          {/* Feature 4: Mandi Prices */}
          <RevealOnScroll
            id="marketplace"
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow md:col-span-1"
          >
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Store size={24} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">Mandi Prices</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real-time market rates from 1000+ APMCs across India.
              </p>
            </div>
            <dl className="mt-4 border-t border-slate-100 pt-4">
              {MANDI_PRICES.map((row) => (
                <div key={row.crop} className="mb-2 flex items-center justify-between last:mb-0">
                  <dt className="text-sm font-medium text-slate-600">{row.crop}</dt>
                  <dd className="text-sm font-bold text-purple-600">{row.price}</dd>
                </div>
              ))}
            </dl>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
