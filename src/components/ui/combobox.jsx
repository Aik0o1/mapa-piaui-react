import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ComboboxCidades() {
  const [open, setOpen] = React.useState(false);
  const [cidades, setCidades] = useState([]); 
  const [value, setValue] = useState("");

  // requisição a api, seu retorno é um array com o nome das cidades
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/cidades");
        const data = await response.json();
        setCidades(data); 
      } catch (error) {
        console.error("Erro ao buscar dados do CouchDB:", error);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (currentValue) => {
    setValue(currentValue); 
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value || "Selecione uma cidade"} 
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar cidade" />
          <CommandList>
            {cidades.length === 0 && <CommandEmpty>Carregando cidades...</CommandEmpty>} 
            {cidades.length > 0 && (
              <CommandGroup>
                {cidades.map((cidade) => (
                  <CommandItem
                    key={cidade}
                    value={cidade}
                    onSelect={() => handleSelect(cidade)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === cidade ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {cidade}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
