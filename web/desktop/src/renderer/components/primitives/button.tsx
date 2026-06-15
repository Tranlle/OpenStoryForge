import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@renderer/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-control text-sm font-semibold transition duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-foreground shadow-lift hover:translate-y-[-1px] hover:brightness-105",
        secondary:
          "border border-border bg-surface/70 text-foreground shadow-panel hover:bg-surface",
        ghost: "text-muted hover:bg-surface/70 hover:text-foreground"
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild = false, className, size, variant, ...props },
  ref,
): JSX.Element {
  const Comp = asChild ? Slot : "button";

  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
