import type { CSSProperties } from "react";

type CounterProps = {
  value: number;
};

export default function Counter({ value }: CounterProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className="v-count"
        style={{ "--count": value } as CSSProperties}
      />
      <span className="sr-only">{value}</span>
    </>
  );
}
