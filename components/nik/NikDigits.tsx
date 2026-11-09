import { OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";
import {
  type ComponentPropsWithoutRef,
  Fragment,
  type ReactNode,
  forwardRef,
  useContext,
} from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  inputOTPSlotVariants,
} from "~/components/ui/input-otp";
import { NIK_LENGTH } from "~/lib/const";
import {
  SEGMENTS,
  type Segment,
  type SegmentKey,
  segmentAt,
} from "~/lib/nik-segments";
import { cn } from "~/lib/utils";

const indexesOf = (segment: Segment) =>
  Array.from(
    { length: segment.end - segment.start },
    (_, i) => segment.start + i,
  );

/**
 * The five segments side by side, each with its digit cells, a bar in the
 * segment's color that fills as its digits arrive, and a label. From `md` up it
 * is one row; below that the region (6 digits) sits above the birth date and
 * sequence number (10 digits), so 16 cells fit a 320px screen.
 */
const SegmentRow = ({
  renderCells,
  filledCount,
  activeKey,
  highlight,
  invalid = [],
  animateFill = false,
}: {
  /** `quiet` is true for segments a highlight pushes back. */
  renderCells: (segment: Segment, quiet: boolean) => ReactNode;
  /** How many of this segment's digits are known. */
  filledCount: (segment: Segment) => number;
  activeKey?: SegmentKey | null;
  /** Segments that didn't decode: red edges, red bar, red label. */
  invalid?: readonly SegmentKey[];
  /**
   * Pushes every other segment back: no tint, empty bar, muted digits. Muted,
   * not faded, so the digits keep their contrast.
   */
  highlight?: SegmentKey;
  /**
   * Ease the bars as they fill. Off for typing: a keystroke should land at
   * once, not trail a transition. On for picks in the generator.
   */
  animateFill?: boolean;
}) => (
  <div className="flex flex-wrap items-start gap-x-2 gap-y-3 md:flex-nowrap md:gap-x-2.5">
    {SEGMENTS.map((segment) => {
      const size = segment.end - segment.start;
      const quiet = !!highlight && highlight !== segment.key;
      const fill = quiet ? 0 : Math.min(1, filledCount(segment) / size);
      const isActive = activeKey === segment.key || highlight === segment.key;
      const isInvalid = invalid.includes(segment.key);

      return (
        <Fragment key={segment.key}>
          {segment.key === "birthDate" && (
            <div aria-hidden="true" className="basis-full md:hidden" />
          )}
          <div
            data-seg={segment.key}
            data-invalid={isInvalid || undefined}
            className="group/seg flex flex-col gap-1.5"
          >
            {renderCells(segment, quiet)}
            <span
              aria-hidden="true"
              className="relative h-1 overflow-hidden rounded-sm bg-seg/20"
            >
              <span
                className={cn(
                  "absolute inset-0 origin-left rounded-sm bg-seg group-data-[invalid=true]/seg:bg-destructive",
                  animateFill && "transition-transform duration-200 ease-out",
                )}
                style={{ transform: `scaleX(${fill})` }}
              />
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "whitespace-nowrap text-xs leading-none text-muted-foreground",
                isActive && "font-medium text-foreground",
                isInvalid && "font-medium text-destructive",
              )}
            >
              <span className="md:hidden">{segment.short}</span>
              <span className="hidden md:inline">{segment.label}</span>
            </span>
          </div>
        </Fragment>
      );
    })}
  </div>
);

/** Reads the focused state from inside the OTP input to light up the active segment. */
const InputSegments = ({
  invalid,
}: {
  invalid?: readonly SegmentKey[];
}) => {
  const { slots, isFocused } = useContext(OTPInputContext);
  const length = slots.filter((slot) => slot.char !== null).length;
  const active = isFocused ? segmentAt(length) : null;

  return (
    <SegmentRow
      activeKey={active?.key}
      invalid={invalid}
      filledCount={(segment) =>
        Math.max(0, Math.min(length, segment.end) - segment.start)
      }
      renderCells={(segment) => (
        <InputOTPGroup>
          {indexesOf(segment).map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      )}
    />
  );
};

type NikInputProps = Omit<
  ComponentPropsWithoutRef<typeof InputOTP>,
  "maxLength" | "render" | "children" | "pattern"
> & {
  /** Segments of the current value that didn't decode. */
  invalidSegments?: readonly SegmentKey[];
};

/**
 * The NIK field: 16 digit cells grouped the way a NIK is built. Typing and
 * pasting go through one real input underneath (input-otp), so labels,
 * autofill, the numeric keyboard and screen readers all treat it as a single
 * text field.
 */
export const NikInput = forwardRef<HTMLInputElement, NikInputProps>(
  ({ containerClassName, onPasteCapture, invalidSegments, ...props }, ref) => (
    <InputOTP
      ref={ref}
      maxLength={NIK_LENGTH}
      pattern={REGEXP_ONLY_DIGITS}
      inputMode="numeric"
      autoComplete="off"
      // Pasting "3204 0545 0190 0001" or "3204-05..." keeps every digit.
      pasteTransformer={(text) => text.replace(/\D/g, "")}
      // A whole NIK pasted into a half-typed field replaces it. Without this,
      // input-otp inserts it at the caret and keeps the first 16 digits.
      onPasteCapture={(event) => {
        const pasted = event.clipboardData.getData("text/plain");
        if (pasted.replace(/\D/g, "").length >= NIK_LENGTH) {
          const input = event.currentTarget;
          input.setSelectionRange(0, input.value.length);
        }
        onPasteCapture?.(event);
      }}
      containerClassName={cn("w-fit", containerClassName)}
      {...props}
    >
      <InputSegments invalid={invalidSegments} />
    </InputOTP>
  ),
);
NikInput.displayName = "NikInput";

/**
 * A read-only NIK in the same cells. Positions that aren't digits render empty
 * (still unknown), except `x`, which marks digits that can't be known at all.
 */
export const NikReadout = ({
  digits,
  label,
  highlight,
  className,
}: {
  /** 16 characters. */
  digits: string;
  /** What a screen reader hears instead of 16 cells. */
  label: string;
  highlight?: SegmentKey;
  className?: string;
}) => {
  const isDigit = (index: number) => /\d/.test(digits[index] ?? "");

  return (
    <div role="img" aria-label={label} className={className}>
      <SegmentRow
        animateFill
        highlight={highlight}
        filledCount={(segment) => indexesOf(segment).filter(isDigit).length}
        renderCells={(segment, quiet) => (
          <div className="flex items-center">
            {indexesOf(segment).map((index) => (
              <div
                key={index}
                data-filled={isDigit(index) && !quiet}
                className={cn(
                  inputOTPSlotVariants(),
                  quiet && "text-muted-foreground",
                )}
              >
                {isDigit(index) ? (
                  digits[index]
                ) : digits[index] === "x" ? (
                  <span className="text-muted-foreground">x</span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};
