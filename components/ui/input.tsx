import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm text-dragon-dark shadow-sm",
            "placeholder:text-slate-400",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-pitaya-500 focus:border-pitaya-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-400 focus:ring-red-400",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
