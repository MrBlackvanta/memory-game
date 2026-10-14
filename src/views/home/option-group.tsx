import type { SettingField, Settings } from "@/data";

type OptionGroupProps = SettingField & {
  checked: Settings[keyof Settings];
};

export default function OptionGroup({
  name,
  legend,
  options,
  checked,
}: OptionGroupProps) {
  const gap = options.length > 2 ? "gap-2.5 md:gap-5.5" : "gap-2.75 md:gap-7.5";

  return (
    <fieldset className="min-w-0">
      <legend className="text-muted text-label md:text-label-md">
        {legend}
      </legend>
      <div className={`mt-2.75 grid auto-cols-fr grid-flow-col md:mt-4 ${gap}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className="bg-mist text-option text-navy has-checked:bg-navy has-checked:text-paper has-focus-visible:outline-ink hover:not-has-checked:bg-steel hover:not-has-checked:text-paper md:text-option-md relative flex h-10 cursor-pointer items-center justify-center rounded-full has-focus-visible:outline-2 has-focus-visible:outline-offset-2 motion-safe:transition-colors md:h-13"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === checked}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
