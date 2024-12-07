import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { X } from "lucide-react";

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  value = [], // Provide default empty array
  onChange,
  options,
  placeholder,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option]
    );
  };

  return (
    <Command className={`border rounded-md ${className || ""}`}>
      <div className="flex flex-wrap gap-1 p-2">
        {value.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
            <button className="ml-1" onClick={() => handleSelect(item)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <CommandGroup>
        {options.map((option) => (
          <CommandItem
            key={option.value}
            onSelect={() => handleSelect(option.value)}
          >
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}
