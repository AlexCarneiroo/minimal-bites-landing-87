
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"


const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: 
          "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl active:scale-95",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl active:scale-95",
        outline:
          "border-2 border-blue-500 bg-transparent text-blue-600 hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg active:scale-95",
        secondary:
          "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 hover:from-slate-200 hover:to-slate-300 shadow-md hover:shadow-lg active:scale-95",
        ghost: 
          "hover:bg-blue-500/10 hover:text-blue-600 rounded-lg active:scale-95",
        link: 
          "text-blue-600 underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 shadow-xl hover:shadow-2xl active:scale-95",
        premium: 
          "bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 shadow-xl hover:shadow-2xl active:scale-95",
        glass: 
          "bg-white/20 backdrop-blur-lg border border-white/30 text-slate-800 hover:bg-white/30 shadow-lg hover:shadow-xl active:scale-95",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
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
