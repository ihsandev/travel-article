import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

interface InputFieldProps {
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  label?: string;
  error?: string;
  formType?: "textarea" | "input";
  rows?: number;
  className?: string;
}

export function InputField({
  name,
  type,
  required,
  placeholder,
  label,
  iconLeft,
  iconRight,
  error,
  formType,
  rows,
  className,
  ...props
}: Readonly<InputFieldProps>) {
  return (
    <div className="flex flex-col">
      <Label htmlFor="email" className={cn("mb-2", error && "text-rose-500")}>
        {label}
      </Label>
      <div className="flex items-center gap-2 relative">
        {iconLeft && (
          <span
            className={cn(
              "absolute left-3 text-slate-400",
              error && "text-rose-500"
            )}
          >
            {iconLeft}
          </span>
        )}
        {formType === "textarea" ? (
          <Textarea
            name={name}
            required={required}
            placeholder={placeholder}
            rows={rows}
            className={cn(
              "rounded-full px-3 h-10 focus-visible:ring-0 focus-visible:ring-offset-0",
              iconLeft && "pl-9",
              iconRight && "pr-9",
              error && "border-rose-500",
              className
            )}
            {...props}
          />
        ) : (
          <>
            <Input
              name={name}
              type={type}
              required={required}
              placeholder={placeholder}
              className={cn(
                "rounded-full px-3 h-10 focus-visible:ring-0 focus-visible:ring-offset-0",
                iconLeft && "pl-9",
                iconRight && "pr-9",
                error && "border-rose-500",
                className
              )}
              {...props}
            />
            {iconRight && (
              <span
                className={cn(
                  "absolute right-3 text-slate-400",
                  error && "text-rose-500"
                )}
              >
                {iconRight}
              </span>
            )}
          </>
        )}
      </div>
      {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
