import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
  }
>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-violet-300/35 bg-violet-500 text-white shadow-lg shadow-violet-900/25 hover:border-violet-200/45 hover:bg-violet-400 hover:shadow-violet-900/40 active:scale-[0.99] active:bg-violet-500/90 disabled:border-violet-400/25 disabled:bg-violet-500/35 disabled:shadow-none disabled:text-white/70",
  secondary:
    "border border-white/14 bg-white/7 text-white/85 hover:border-white/24 hover:bg-white/12 hover:text-white active:scale-[0.99] active:bg-white/16 disabled:text-white/45 disabled:hover:border-white/14 disabled:hover:bg-white/7",
  danger:
    "border border-red-400/35 bg-red-500/12 text-red-100 hover:border-red-300/65 hover:bg-red-500/22 hover:text-white active:scale-[0.99] active:bg-red-500/28 disabled:border-red-300/20 disabled:text-red-200/60",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-4.5 py-2.5 text-sm",
};

function Button({
  variant = "secondary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl font-semibold tracking-[0.01em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a12] disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
