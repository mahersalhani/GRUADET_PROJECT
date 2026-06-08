"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "color-mix(in oklch, var(--primary) 20%, var(--border))",
          "--border-radius": "var(--radius)",
          "--success-border": "color-mix(in oklch, var(--primary) 35%, var(--border))",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
