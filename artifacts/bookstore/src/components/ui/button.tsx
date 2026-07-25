import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90 hover:shadow-xl hover:shadow-destructive/25 hover:-translate-y-0.5",
        outline:
          "border-2 border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25 hover:bg-secondary/90 hover:shadow-xl hover:shadow-secondary/30 hover:-translate-y-0.5",
        ghost:
          "hover:bg-accent/80 hover:text-accent-foreground hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5",
        glass:
          "bg-background/60 backdrop-blur-md border border-border/50 text-foreground shadow-sm hover:bg-background/80 hover:border-border hover:-translate-y-0.5",
        threeD:
          "bg-primary text-primary-foreground shadow-[0_4px_0_0_hsl(var(--primary-border))] hover:shadow-[0_2px_0_0_hsl(var(--primary-border))] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
        "threeD-secondary":
          "bg-secondary text-secondary-foreground shadow-[0_4px_0_0_hsl(35_60%_40%)] hover:shadow-[0_2px_0_0_hsl(35_60%_40%)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 hover:-translate-y-0.5",
        "soft-secondary":
          "bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-5 py-2 rounded-lg",
        sm: "h-8 rounded-md px-3 text-xs gap-1",
        lg: "h-12 rounded-xl px-8 text-base gap-2",
        xl: "h-14 rounded-xl px-10 text-lg gap-2",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
      shape: {
        default: "rounded-lg",
        pill: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, shape, className }),
          isLoading && "relative text-transparent hover:text-transparent"
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center text-current/60">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span className="pointer-events-auto">{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
