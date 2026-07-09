"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import type { AuthInputProps } from "@/types/auth";

/**
 * Reusable auth text input with label, icon slot, and error state.
 * Handles default / hover / focus / disabled / error visual states.
 */
const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    { label, error, icon, containerClassName, className, id, disabled, ...props },
    ref
  ) => {
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
          {icon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant transition-colors group-focus-within:text-primary"
            >
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full rounded-xl border border-outline-variant bg-white py-3.5 pr-4 text-on-surface placeholder:text-outline/60",
              "transition-all duration-200 outline-none",
              "hover:border-outline",
              "focus:border-primary focus:ring-4 focus:ring-primary/10",
              "disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:text-outline",
              icon ? "pl-11" : "pl-4",
              error &&
                "border-error focus:border-error focus:ring-error/10",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1 text-sm text-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
