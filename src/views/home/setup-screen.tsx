import { Button } from "@/components/ui";
import { SETTING_FIELDS, SITE_NAME, type Settings } from "@/data";
import { readSettings } from "@/lib";
import type { SubmitEvent } from "react";
import OptionGroup from "./option-group";

type SetupScreenProps = {
  preselected: Settings;
  focusOnMount: boolean;
  onStart: (settings: Settings) => void;
};

function focusCheckedOption(form: HTMLFormElement | null) {
  form?.querySelector<HTMLInputElement>(":checked")?.focus();
}

export default function SetupScreen({
  preselected,
  focusOnMount,
  onStart,
}: SetupScreenProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onStart(readSettings(new FormData(event.currentTarget)));
  }

  return (
    <main
      data-screen="setup"
      className="flex min-h-dvh flex-col items-center justify-center p-6"
    >
      <h1 className="text-logo text-paper md:text-logo-md">{SITE_NAME}</h1>
      <form
        ref={focusOnMount ? focusCheckedOption : undefined}
        aria-label="Game setup"
        onSubmit={handleSubmit}
        className="bg-paper rounded-card md:rounded-panel mt-11.25 flex w-full max-w-163.5 flex-col gap-6 p-6 md:mt-19.5 md:gap-8 md:p-14"
      >
        {SETTING_FIELDS.map((field) => (
          <OptionGroup
            key={field.name}
            {...field}
            checked={preselected[field.name]}
          />
        ))}
        <Button
          type="submit"
          variant="primary"
          className="text-cta md:text-cta-md mt-2 h-12 md:mt-0 md:h-17.5"
        >
          Start Game
        </Button>
      </form>
    </main>
  );
}
