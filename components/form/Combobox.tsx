import { Combobox as ComboboxHeadless } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FC, useState } from "react";
import { Control, useController } from "react-hook-form";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  className?: string;
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: generic wrapper accepts a control for any form shape
  control: Control<any, any>;
  isDisabled?: boolean;
}

export const Combobox: FC<Props> = ({
  label,
  options,
  className,
  control,
  name,
  isDisabled,
}) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        });

  const { field } = useController({
    name,
    control,
  });

  const { onChange, value } = field;

  return (
    <ComboboxHeadless
      as="div"
      onChange={(value) => {
        onChange(value);
      }}
      className={className}
      disabled={isDisabled}
      value={value}
    >
      <ComboboxHeadless.Label className="block text-sm font-medium text-content">
        {label}
      </ComboboxHeadless.Label>
      <div className="relative mt-2">
        <ComboboxHeadless.Input
          className="w-full rounded-xl border border-line bg-surface py-2.5 pl-3.5 pr-10 text-sm text-content shadow-sm outline-none transition-colors placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          displayValue={(value: Props["options"][number]) => value?.label}
          placeholder={`Pilih ${label}`}
          id={name}
          name={name}
        />
        <ComboboxHeadless.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-2.5 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-faint"
            aria-hidden="true"
          />
        </ComboboxHeadless.Button>

        {filteredOptions.length > 0 && (
          <ComboboxHeadless.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-line bg-surface py-1 text-base shadow-card focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <ComboboxHeadless.Option
                key={option.value}
                value={option}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2.5 pl-3.5 pr-9 text-xs transition-colors",
                    active ? "bg-primary text-primary-fg" : "text-content",
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold",
                      )}
                    >
                      {option.label}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-3.5",
                          active ? "text-primary-fg" : "text-primary",
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </ComboboxHeadless.Option>
            ))}
          </ComboboxHeadless.Options>
        )}
      </div>
    </ComboboxHeadless>
  );
};
