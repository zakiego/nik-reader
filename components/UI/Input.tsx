import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  InputHTMLAttributes,
} from "react";

interface Props {
  label: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  containerProps?: DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
}

export const Input: FC<Props> = (props) => {
  const { label, inputProps, containerProps } = props;

  return (
    <div {...containerProps}>
      <label className="block text-sm font-medium text-content">
        {label}
        <input
          className="mt-2 block w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-content shadow-sm outline-none transition-colors [color-scheme:light] placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/25"
          {...inputProps}
        />
      </label>
    </div>
  );
};
