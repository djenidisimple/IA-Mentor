import * as React from "react";

const buttonVariants = {
  default: "bg-[var(--navy)] text-white hover:bg-[#2A3050] shadow-lg shadow-[var(--navy)]/10",
  outline: "bg-white text-[var(--navy)] border border-[var(--border-pink)] hover:bg-gray-50",
  ghost: "hover:bg-gray-100 text-[var(--gray)]",
  secondary: "bg-[var(--yellow)] text-[var(--navy)] font-extrabold hover:brightness-105 shadow-lg shadow-[var(--yellow)]/20",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

const buttonSizes = {
  default: "h-11 px-6",
  sm: "h-9 px-4 text-xs",
  lg: "h-14 px-10 text-sm",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--navy)]/20 disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
