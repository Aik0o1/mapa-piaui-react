import { useEffect, useState } from "react";
import * as d3 from "d3";
import { ComboboxCidades } from "../ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

export default function Filtros(props) {
  const apiUrl = import.meta.env.VITE_URL_API;
  const apiToken = import.meta.env.VITE_API_TOKEN;

  const [meses] = useState([
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ]);

  const mesesDict = {
    "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril",
    "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto",
    "09": "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro",
  };

  const [selectedMes, setSelectedMes] = useState(props.selectedMonth);
  const [selectedAno, setSelectedAno] = useState(props.selectedYear);
  const [dataRecente, setDataRecente] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${apiUrl}/data_recente`;
        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${apiToken}` },
        });
        const data = await response.json();
        setDataRecente(data);
      } catch (error) {
        console.error("Erro ao buscar dados do servidor:", error);
      }
    };
    fetchData();
  }, [apiUrl, apiToken]);

  const handleCidadeSelect = (cidade) => {
    props.onCidadeSelecionada(cidade);
  };

  const handleMesSelect = (mes) => {
    setSelectedMes(mes);
    props.onMesSelecionado(mes);
  };

  const handleAnoSelect = (ano) => {
    setSelectedAno(ano);
    props.onAnoSelecionado(ano);
  };

  const highlightCityOnMap = () => {
    d3.select("#map")
      .selectAll(".city")
      .classed("selected", false)
      .classed("no-selected", false);
  };

  const limparFiltros = () => {
    if (dataRecente) {
      const mesRecente = mesesDict[dataRecente.mes];
      setSelectedMes(mesRecente);
      setSelectedAno(dataRecente.ano);
      
      props.onMesSelecionado(mesRecente);
      props.onAnoSelecionado(dataRecente.ano);
      props.onCidadeSelecionada({ nome: "Selecione uma localidade", id: "" });
      highlightCityOnMap();
    }
  };

  return (
    <div className="filtros text-[#034ea2] p-4">

      <div className="flex flex-wrap items-center  gap-6  justify-center ">
        
        <div className="flex w-full flex-col items-center gap-2 md:w-auto md:flex-row md:items-center md:gap-3">
          <p className="whitespace-nowrap text-sm font-medium lg:text-base">
            Selecione uma localidade
          </p>
          <div className="w-full md:min-w-[250px] text-center">
            <ComboboxCidades
              onCidadeSelect={handleCidadeSelect}
              cidadeSelecionada={props.cidadeSelecionada}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-2 md:w-auto md:flex-row md:items-center md:gap-3">
          <p className="whitespace-nowrap text-sm font-medium lg:text-base legendaPeriodo">
            Selecione o período
          </p>
          
          <div className="flex w-full gap-2 md:w-auto ">
            <Select className="anoEscolha" onValueChange={handleAnoSelect} value={selectedAno}>
              <SelectTrigger className="flex-1 md:w-[140px] lg:w-[160px] anoEscolha">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 7 }, (_, i) => {
                  const ano = 2019 + i;
                  return (
                    <SelectItem key={ano} value={ano.toString()}>
                      {ano}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select onValueChange={handleMesSelect} value={selectedMes}>
              <SelectTrigger className=" mesEscolha flex-1 md:w-[140px] lg:w-[160px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {meses.map((mes, index) => (
                  <SelectItem key={index} value={mes}>
                    {mes}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Botão de Limpar Filtros */}
          <Button
            className="w-full md:w-[120px] lg:w-[140px] text-xs lg:text-sm limpar-filtros"
            variant="outline"
            onClick={limparFiltros}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
