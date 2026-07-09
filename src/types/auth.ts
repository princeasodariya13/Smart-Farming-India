export type AuthFieldState = "default" | "focus" | "error" | "disabled";

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthStatus {
  type: "idle" | "loading" | "error" | "success";
  message?: string;
}

export interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}
