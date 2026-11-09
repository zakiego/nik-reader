import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Spinner } from "~/components/ui/spinner";
import type { RegionOption } from "~/lib/region-client";
import { cn } from "~/lib/utils";

/**
 * A searchable region picker (shadcn's Popover + Command combobox). Each level
 * of the provinsi → kabupaten → kecamatan cascade is one of these.
 */
export const RegionCombobox = ({
  id,
  label,
  noun,
  options,
  value,
  onChange,
  disabled,
  disabledHint,
  isLoading,
  isError,
  onRetry,
}: {
  id: string;
  label: string;
  /** Lowercase name used in the placeholder and search box. */
  noun: string;
  options: RegionOption[];
  value: RegionOption | null;
  onChange: (option: RegionOption) => void;
  disabled?: boolean;
  /** Why the field is disabled, e.g. "Pilih provinsi dulu." */
  disabledHint?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const hintId = `${id}-hint`;

  return (
    <Field
      data-disabled={disabled || undefined}
      data-invalid={isError || undefined}
      className="gap-2"
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-describedby={disabled || isError ? hintId : undefined}
            disabled={disabled}
            className="h-auto min-h-11 w-full justify-between whitespace-normal px-3 py-2.5 text-left font-normal"
          >
            <span
              className={cn(
                "min-w-0 break-words",
                !value && "text-muted-foreground",
              )}
            >
              {value?.label ?? `Pilih ${noun}`}
            </span>
            {isLoading ? (
              <Spinner aria-label={`Memuat daftar ${noun}`} />
            ) : (
              <ChevronsUpDownIcon
                aria-hidden="true"
                className="text-muted-foreground"
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[--radix-popover-trigger-width] min-w-64 p-0"
        >
          <Command>
            <CommandInput placeholder={`Cari ${noun}…`} />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Memuat…" : `${label} tidak ditemukan.`}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    // Search by name and by code, so "3204" finds Kab. Bandung.
                    value={`${option.label} ${option.value}`}
                    onSelect={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    <span className="min-w-0 flex-1">{option.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {option.value}
                    </span>
                    <CheckIcon
                      aria-hidden="true"
                      className={cn(
                        value?.value === option.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isError ? (
        <FieldError id={hintId} className="flex flex-wrap items-center gap-x-2">
          Daftar {noun} gagal dimuat.
          {onRetry && (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={onRetry}
            >
              Coba lagi
            </Button>
          )}
        </FieldError>
      ) : disabled && disabledHint ? (
        <FieldDescription id={hintId}>{disabledHint}</FieldDescription>
      ) : null}
    </Field>
  );
};
