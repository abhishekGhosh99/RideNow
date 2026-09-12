import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-secondary/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors outline-none",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  );
}

export { Input };