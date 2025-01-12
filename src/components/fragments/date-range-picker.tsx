"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { INITIAL_RANGE_DATE } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelectPicker: (date: DateRange) => void;
}

export function CalendarDateRangePicker({
  className,
  onSelectPicker,
}: Readonly<DateRangePickerProps>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: INITIAL_RANGE_DATE.startDate,
    to: INITIAL_RANGE_DATE.endDate,
  });

  const handleSelect = (value: DateRange) => {
    setDate(value);
    onSelectPicker(value);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(date) => handleSelect(date!)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
