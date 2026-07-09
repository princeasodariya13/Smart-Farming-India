"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";
import AuthDivider from "./AuthDivider";
import AuthFooter from "./AuthFooter";
import type { AuthStatus, LoginFormValues } from "@/types/auth";

interface LoginFormProps {
  /** Wire this to your existing auth logic. UI only calls it on submit. */
  onSubmit?: (values: LoginFormValues) => void | Promise<void>;
  /** Wire this to your existing Google sign-in flow. */
  onGoogleSignIn?: () => void | Promise<void>;
  status?: AuthStatus;
  fieldErrors?: Partial<Record<keyof LoginFormValues, string>>;
}

/**
 * Presentational login form. Holds only local UI state (input values,
 * password visibility is handled inside PasswordInput). All auth/business
 * logic is injected via props from the parent/page.
 */
export default function LoginForm({
  onSubmit,
  onGoogleSignIn,
  status = { type: "idle" },
  fieldErrors,
}: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const isLoading = status.type === "loading";

  function handleChange<K extends keyof LoginFormValues>(key: K, value: LoginFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;
    await onSubmit?.(values);
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-on-surface">
          Welcome Back
        </h1>
        <p className="text-base text-on-surface-variant">
          Sign in to manage your farm&apos;s digital ecosystem.
        </p>
      </div>

      {status.type === "error" && status.message && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-2 rounded-xl border border-error/30 bg-error-container/40 px-4 py-3 text-sm text-error"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      {status.type === "success" && status.message && (
        <div
          role="status"
          className="mb-6 flex items-center gap-2 rounded-xl border border-primary/30 bg-success-soft px-4 py-3 text-sm text-primary"
        >
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <AuthInput
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail size={18} />}
          required
          disabled={isLoading}
          error={fieldErrors?.email}
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <div className="space-y-2">
          <PasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            disabled={isLoading}
            error={fieldErrors?.password}
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={values.rememberMe}
            onChange={(e) => handleChange("rememberMe", e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed"
          />
          <label htmlFor="rememberMe" className="text-sm text-on-surface-variant">
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-surface-tint hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          {isLoading && <Loader2 size={18} className="animate-spin" />}
          {isLoading ? "Signing in…" : "Sign In to Farm"}
        </button>

        <AuthDivider />

        <GoogleButton onClick={onGoogleSignIn} disabled={isLoading} />
      </form>

      <AuthFooter />
    </div>
  );
}
