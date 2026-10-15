import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type IconProps = {
  definition: IconDefinition;
  className?: string;
};

export default function Icon({ definition, className }: IconProps) {
  const [width, height, , , paths] = definition.icon;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {[paths].flat().map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
