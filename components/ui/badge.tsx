import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/85",
        destructive:
          "border-transparent bg-destructive/20 text-red-400 border-red-500/30 hover:bg-destructive/30 glow-red",
        warning:
          "border-transparent bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30 glow-orange",
        success:
          "border-transparent bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 glow-green",
        info:
          "border-transparent bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30",
        outline: "text-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
