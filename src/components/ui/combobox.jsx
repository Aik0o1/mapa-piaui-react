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

export function ComboboxCidades({ dadosCsv, onCidadeSelecionada, selectedCity }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  // Efeito para atualizar o valor quando uma cidade é selecionada no mapa
  React.useEffect(() => {
    if (selectedCity) {
      setValue(selectedCity.Município)
    }
  }, [selectedCity])

  const handleSelect = (currentValue) => {
    setValue(currentValue === value ? "" : currentValue)
    setOpen(false)

    // Encontrar o objeto da cidade completo
    const cidadeSelecionada = dadosCsv.find(
      (cidade) => cidade.Município === currentValue
    )

    // Chamar a função de callback para passar a cidade selecionada
    if (cidadeSelecionada && onCidadeSelecionada) {
      onCidadeSelecionada(cidadeSelecionada)
    }
  }

  return (
    dadosCsv && (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
          >
            {value
              ? value
              : "Selecione uma cidade..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Buscar cidade..." />
            <CommandList>
              <CommandEmpty>Cidade não encontrada.</CommandEmpty>
              <CommandGroup>
                {dadosCsv.map((cidade) => (
                  <CommandItem
                    key={cidade.Município}
                    value={cidade.Município}
                    onSelect={handleSelect}
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
    )
  )
}