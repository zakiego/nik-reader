import { FC, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox as ComboboxHeadless } from "@headlessui/react";
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
  const [selectedPerson, setSelectedPerson] = useState(null);

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

  const { onBlur, onChange, ref, value, ...rest } = field;

  return (
    <ComboboxHeadless
      as="div"
      value={selectedPerson}
      onChange={(value) => {
        setSelectedPerson(value);
        onChange(value);
      }}
      className={className}
      disabled={isDisabled}
    >
      <ComboboxHeadless.Label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </ComboboxHeadless.Label>
      <div className="relative mt-2">
        <ComboboxHeadless.Input
          className={`disabled:cursor-not-allowed disabled:opacity-50 text-sm w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6`}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          displayValue={(person: Props["options"][number]) => person?.label}
        />
        <ComboboxHeadless.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxHeadless.Button>

        {filteredOptions.length > 0 && (
          <ComboboxHeadless.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <ComboboxHeadless.Option
                key={option.value}
                value={option}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9 text-xs",
                    active ? "bg-gray-600 text-white" : "text-gray-900",
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
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-gray-600-600",
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
