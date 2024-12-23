"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ItemsPerPageProps {
  value: number;
  onChange: (value: string) => void;
  options: number[];
  className?: string;
}

export function ItemsPerPage({
  value,
  onChange,
  options,
  className,
}: ItemsPerPageProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Show</span>
        <Select
          value={value.toString()}
          onValueChange={onChange}
        >
          <SelectTrigger className="w-[70px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option}
                value={option.toString()}
                className="text-sm"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm font-medium text-muted-foreground">entries</span>
      </div>
    </div>
  );
} 