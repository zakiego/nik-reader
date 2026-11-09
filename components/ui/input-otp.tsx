import { cva } from "class-variance-authority";
import { OTPInput, OTPInputContext } from "input-otp";
import * as React from "react";

import { cn } from "~/lib/utils";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName,
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

/**
 * One digit cell. Shared with read-only digit readouts so a cell looks the same
 * whether it can be typed into or not. Filled cells pick up a tint of the
 * segment they sit in (`data-seg` on an ancestor), and an invalid Field turns
 * every edge red.
 */
const inputOTPSlotVariants = cva([
  "relative flex h-11 w-[min(2.25rem,calc((100vw-5rem)/10))] items-center justify-center md:h-12 md:w-9",
  "border-y border-r border-input bg-card font-mono text-lg font-medium text-foreground md:text-xl",
  "first:rounded-l-md first:border-l last:rounded-r-md",
  "data-[filled=true]:bg-seg/10 dark:data-[filled=true]:bg-seg/20",
  "data-[active=true]:z-10 data-[active=true]:ring-2 data-[active=true]:ring-ring",
  "group-data-[invalid=true]/field:border-destructive group-data-[invalid=true]/seg:border-destructive",
]);

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={char !== null}
      className={cn(inputOTPSlotVariants(), className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-primary" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot, inputOTPSlotVariants };
