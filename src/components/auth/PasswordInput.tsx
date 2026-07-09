"use client";

import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthInputProps } from "@/types/auth";

/**
 * Password field with a show/hide visibility toggle.
 * Extends the same visual language as AuthInput.
 */
const PasswordInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    { label, error, containerClassName, className, id, disabled, ...props },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-on-surface-variant"
        >
          {label}
        </label>
        <div className="relative group">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant transition-colors group-focus-within:text-primary"
          >
            <Lock size={18} />
          </span>
          <input
            id={inputId}
            ref={ref}
            type={visible ? "text" : "password"}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full rounded-xl border border-outline-variant bg-white py-3.5 pl-11 pr-12 text-on-surface placeholder:text-outline/60",
              "transition-all duration-200 outline-none",
              "hover:border-outline",
              "focus:border-primary focus:ring-4 focus:ring-primary/10",
              "disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:text-outline",
              error &&
                "border-error focus:border-error focus:ring-error/10",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            disabled={disabled}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded disabled:cursor-not-allowed"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-sm text-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
