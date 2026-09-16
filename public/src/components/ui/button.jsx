import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils.js"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Les quatre etats du bouton dans la charte Doneo : normal, survol,
        // secondaire, desactive. Le gris du desactive est impose plutot que
        // l'opacite de shadcn, qui laisserait un violet delave.
        doneo:
          "bg-primary text-primary-foreground font-titre font-semibold shadow-[0_8px_20px_-6px_rgb(155_77_219/50%)] hover:bg-violet-fonce hover:-translate-y-px active:translate-y-px disabled:bg-[#d9d3e2] disabled:text-[#8d8899] disabled:shadow-none disabled:opacity-100",
        doneoSecondaire:
          "border-[1.5px] border-primary bg-transparent text-violet-fonce font-titre font-semibold hover:border-violet-fonce hover:bg-primary/5 hover:-translate-y-px active:translate-y-px",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        // Grande pilule pleine largeur des maquettes mobiles.
        pilule: "h-14 rounded-[1.25rem] px-6 text-lg has-[>svg]:px-5",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
