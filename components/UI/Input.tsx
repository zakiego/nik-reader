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
      <p className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </p>
      <input
        className="mt-2 text-sm  block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
        {...inputProps}
      />
    </div>
  );
};
