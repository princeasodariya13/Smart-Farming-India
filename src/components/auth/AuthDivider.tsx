interface AuthDividerProps {
  label?: string;
}

/** Horizontal divider used to separate auth methods, e.g. "OR". */
export default function AuthDivider({ label = "Or login with" }: AuthDividerProps) {
  return (
    <div className="flex w-full items-center gap-4" role="separator">
      <div className="h-px flex-1 bg-outline-variant/40" />
      <span className="text-xs font-semibold uppercase tracking-widest text-outline">
        {label}
      </span>
      <div className="h-px flex-1 bg-outline-variant/40" />
    </div>
  );
}
