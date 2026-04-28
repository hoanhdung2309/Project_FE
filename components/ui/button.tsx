import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitaya-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-pitaya-500 text-white shadow-card-sm hover:bg-pitaya-600 hover:shadow-pitaya",
        gradient:
          "bg-gradient-pitaya text-white shadow-pitaya hover:brightness-110 hover:shadow-card-lg",
        outline:
          "border-2 border-pitaya-500 text-pitaya-600 bg-transparent hover:bg-pitaya-50",
        ghost:
          "text-dragon-dark hover:bg-slate-100 hover:text-dragon-dark",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600",
        success:
          "bg-cactus-500 text-white shadow-sm hover:bg-cactus-600",
        secondary:
          "bg-slate-100 text-dragon-dark hover:bg-slate-200",
        link:
          "text-pitaya-600 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "text-xs px-3 py-1.5 h-8",
        default: "text-sm px-4 py-2 h-9",
        lg: "text-base px-6 py-3 h-11",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
