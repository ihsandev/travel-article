import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

type Options = {
  value: string;
  label: string;
  title?: string;
};

interface SelectFieldProps extends SelectProps {
  items: Options[];
  placeholder?: string;
}

export function SelectField({
  items = [],
  placeholder,
  ...props
}: Readonly<SelectFieldProps>) {
  return (
    <Select {...props}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder={placeholder ?? "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectGroup key={item.value}>
            {item.title && <SelectLabel>{item.title}</SelectLabel>}
            <SelectItem value={item.value}>{item.label}</SelectItem>
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
