"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  creatable?: boolean;
  disabled?: boolean;
}

export function Combobox({ options, value, onChange, placeholder, emptyMessage, creatable = false, disabled = false }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
    setSearch("");
  };

  const exactMatch = React.useMemo(() => 
    options.some(option => option.label.toLowerCase() === search.toLowerCase()),
    [options, search]
  );

  const showCreateOption = creatable && search && !exactMatch;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value && value.startsWith('create__')
            ? `+ إنشاء: "${value.split('__')[1]}"`
            : value && value !== 'none'
            ? options.find((option) => option.value === value)?.label
            : placeholder || "اختر..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder || "ابحث أو اكتب لإنشاء جديد..."}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {showCreateOption ? (
                <CommandItem
                  value={`create__${search}`}
                  onSelect={() => handleSelect(`create__${search}`)}
                  className="cursor-pointer text-primary"
                >
                  <span className="mr-2 font-bold">+</span> إنشاء &quot;{search}&quot;
                </CommandItem>
              ) : (
                emptyMessage || "لا توجد نتائج."
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    handleSelect(option.value)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 