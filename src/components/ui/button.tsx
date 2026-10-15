import type { ComponentProps } from "react";

const VARIANTS = {
  primary: "bg-accent hover:bg-accent-hover text-navy",
  secondary: "bg-cloud hover:bg-steel text-navy hover:text-paper",
};

type ButtonProps = ComponentProps<"button"> & {
  variant: keyof typeof VARIANTS;
};

export default function Button({
  variant,
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${VARIANTS[variant]} rounded-full motion-safe:transition-colors ${className}`}
      {...props}
    />
  );
}
