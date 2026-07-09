import Link from "next/link";
import { Globe, Mail, MessageCircle } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    heading: "Platform",
    links: [
      { name: "Marketplace", href: "/login" },
      { name: "Weather API", href: "/login" },
      { name: "Yield Prediction", href: "/login" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { name: "Schemes Guide", href: "/schemes" },
      { name: "Community Forum", href: "/community" },
      { name: "Expert Blog", href: "/blog" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Compliance", href: "/compliance" },
    ],
  },
];

const SOCIAL_ICONS = [
  { name: MessageCircle, label: "Visit our community page" },
  { name: Globe, label: "Change site language" },
  { name: Mail, label: "Email us" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="max-w-xs">
            <span className="mb-4 block text-xl font-extrabold text-slate-900 tracking-tight">
              Smart Farming<span className="text-green-600">.</span>
            </span>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Empowering the roots of our nation through advanced AI, real-time data, and
              community-driven solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h4 className="mb-6 font-bold text-slate-900">{column.heading}</h4>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-slate-600 transition-colors hover:text-green-700"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 md:flex-row">
          <p className="text-sm font-semibold text-slate-500">
            &copy; {new Date().getFullYear()} Smart Farming India. Empowering the roots of our nation.
          </p>
          <div className="flex gap-6">
            {SOCIAL_ICONS.map((social, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={social.label}
                className="text-slate-400 transition-colors hover:text-green-600"
              >
                <social.name size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
