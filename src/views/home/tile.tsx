import type { TileState } from "@/lib";
import type { ComponentProps } from "react";

type TileProps = ComponentProps<"button"> & {
  label: string;
  state: TileState;
};

export default function Tile({ label, state, children, ...props }: TileProps) {
  const hidden = state === "hidden";
  const matched = state === "matched";

  return (
    <button
      type="button"
      aria-label={hidden ? "Hidden tile" : label}
      aria-disabled={matched || undefined}
      className="group/tile block size-full rounded-full perspective-normal aria-disabled:cursor-default"
      {...props}
    >
      <span
        className={`grid size-full transform-3d motion-safe:transition-transform motion-safe:duration-300 ${hidden ? "" : "rotate-y-180"}`}
      >
        <span className="bg-navy group-hover/tile:bg-steel col-start-1 row-start-1 rounded-full backface-hidden motion-safe:transition-colors" />
        <span
          className={`col-start-1 row-start-1 rotate-y-180 backface-hidden motion-safe:transition-[visibility] motion-safe:duration-300 ${hidden ? "invisible" : ""}`}
        >
          <span
            className={`grid size-full place-items-center rounded-full motion-safe:transition-colors motion-safe:delay-300 motion-safe:duration-300 ${matched ? "bg-mist text-paper" : "bg-accent text-navy"}`}
          >
            {children}
          </span>
        </span>
      </span>
    </button>
  );
}
