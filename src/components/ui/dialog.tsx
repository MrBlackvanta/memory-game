import type { ComponentProps } from "react";

export default function Dialog({
  className = "",
  ...props
}: ComponentProps<"dialog">) {
  return (
    <dialog
      className={`inset-x-6 m-auto w-auto max-w-163.5 rounded-card bg-dialog backdrop:bg-black/50 motion-safe:backdrop:transition-colors starting:backdrop:bg-transparent ${className}`}
      {...props}
    />
  );
}
