import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-500 text-black font-semibold shadow hover:bg-cyan-400 hover:shadow-cyan-500/25 hover:shadow-lg",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-500 hover:shadow-red-500/25 hover:shadow-lg",
        outline:
          "border border-border bg-transparent shadow-sm hover:bg-muted hover:text-accent-foreground",
        secondary:
          "bg-slate-800 text-white shadow-sm hover:bg-slate-700",
        ghost: "hover:bg-slate-800 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        cyber: 
          "border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-300 shadow-[inset_0_0_10px_rgba(6,182,212,0.05)] hover:shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
