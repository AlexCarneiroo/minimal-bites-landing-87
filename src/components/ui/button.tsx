import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSiteSettings } from "@/contexts/SiteSettingsContext"


// Defina buttonVariants e o tipo para VariantProps fora do componente, só para tipagem
const dummyButtonVariants = cva(
  "", // não importa as classes para o tipo
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "",
        secondary: "",
        ghost: "",
        link: "",
        gradient: "",
        premium: "",
        glass: "",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dummyButtonVariants> {
  asChild?: boolean;
}
const variantStyles = (
  variant: string,
  corPrimaria: string
): React.CSSProperties => {
  switch (variant) {
    case "default":
      return { background: corPrimaria, color: "#fff" };
    case "outline":
      return {
        background: "transparent",
        color: corPrimaria,
        border: `2px solid ${corPrimaria}`,
      };
    case "ghost":
      return {
        background: corPrimaria + "10",
        color: corPrimaria,
      };
    case "link":
      return { color: corPrimaria };
    case "gradient":
      return {
        background: `linear-gradient(90deg, ${corPrimaria}, #8f5cf6 100%)`,
        color: "#fff",
      };
    default:
      return {};
  }
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", asChild = false, style, ...props },
    ref
  ) => {
    const { settings } = useSiteSettings();
    const corPrimaria = settings?.primaryColor || "#0066cc";

    // Adapte as classes de tamanho conforme seu design system
    const sizeClasses =
      size === "sm"
        ? "h-9 rounded-lg px-3 text-xs"
        : size === "lg"
        ? "h-13 rounded-xl px-8 text-base"
        : size === "icon"
        ? "h-11 w-11"
        : "h-11 px-6 py-2.5";

    // Classes base para todos
    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden";

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          baseClasses,
          sizeClasses,
          className
        )}
        ref={ref}
        style={{
          ...variantStyles(variant, corPrimaria),
          ...style,
        }}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
