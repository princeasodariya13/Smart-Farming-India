import Link from "next/link";

/** Footer with register link + legal links. Pure UI, routes point to existing pages. */
export default function AuthFooter() {
  return (
    <footer className="mt-10 space-y-4 text-center">
      <p className="text-sm text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
        >
          Sign up
        </Link>
      </p>
      <div className="text-xs text-outline">
        <p>© {new Date().getFullYear()} Smart Farming India. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
