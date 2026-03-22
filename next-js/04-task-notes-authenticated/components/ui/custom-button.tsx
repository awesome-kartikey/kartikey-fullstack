// components/ui/custom-button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const customButtonVariants = cva(
  "relative overflow-hidden transition-all duration-200",
  {
    variants: {
      intent: {
        success: "bg-green-600 hover:bg-green-700 text-white",
        warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
      },
      glow: {
        true: "shadow-lg hover:shadow-xl",
        false: "",
      }
    },
    defaultVariants: {
      glow: false,
    },
  }
);

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof customButtonVariants> {}

export function CustomButton({
  className,
  intent,
  glow,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      className={cn(customButtonVariants({ intent, glow }), className)}
      {...props}
    />
  );
}