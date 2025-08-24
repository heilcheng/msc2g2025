import React from "react"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  icon?: React.ElementType
  align?: "left" | "center"
  size?: "sm" | "md" | "lg"
  actions?: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  align = "left",
  size = "md",
  actions,
  className,
  as = "h1",
}: PageHeaderProps) {
  const HeadingTag = as as any

  const titleClasses = cn(
    "font-bold text-foreground tracking-tight",
    size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-xl",
    align === "center" && "mx-auto"
  )

  const subtitleClasses = cn(
    "text-muted-foreground",
    size === "lg" ? "text-base" : "text-sm",
    align === "center" && "mx-auto"
  )

  return (
    <div
      className={cn(
        "mb-8",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {align === "left" ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <HeadingTag className={titleClasses}>{title}</HeadingTag>
              {subtitle ? (
                <div className={subtitleClasses}>{subtitle}</div>
              ) : null}
            </div>
          </div>
          {actions}
        </div>
      ) : (
        <div>
          {Icon && (
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                <Icon className="w-8 h-8" />
              </div>
            </div>
          )}
          <HeadingTag className={titleClasses}>{title}</HeadingTag>
          {subtitle ? <div className={cn("mt-1", subtitleClasses)}>{subtitle}</div> : null}
        </div>
      )}
      <div
        className={cn(
          "mt-3 h-1 rounded-full bg-gradient-to-r from-primary/40 via-accent/50 to-primary/40",
          align === "center" ? "mx-auto w-24" : "ml-0 w-16"
        )}
      />
    </div>
  )
}


