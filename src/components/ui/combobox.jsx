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


export function ComboboxDemo({ dadosCsv }) {

    const cidades = dadosCsv
    console.log(cidades)

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    cidades &&
    <React.Fragment>

    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          >
          {value
            ? cidades.find((cidade) => cidade.Município === value)?.label
            : "Select cidade..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search cidade..." />
          <CommandList>
            <CommandEmpty>No cidade found.</CommandEmpty>
            <CommandGroup>
              {cidades.map((cidade) => (
                  <CommandItem
                  key={cidade.Município}
                  value={cidade.Município}
                  onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                    >
                  <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        value === cidade.Município ? "opacity-100" : "opacity-0"
                    )}
                    />
                  {cidade.Município}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
              </React.Fragment>
  )
}
