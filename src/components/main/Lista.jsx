import React, { useState, useEffect } from "react";
import { MapPin, Building2, LandPlot, Clock2 } from "lucide-react";
import TemposAnalise from './TemposAnalise';
import TreeMap from "../graphs/treeMap";
import PieCharts from "../graphs/PieCharts";
import { AccordionItem, Accordion, AccordionTrigger, AccordionContent } from "../ui/accordion";

export default function Lista({ onCidadeSelecionada }) {
  const [dados, setDados] = useState(null);
  const [selectedCity, setSelectedCity] = useState(onCidadeSelecionada?.id || '221100');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/dados");
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar dados do CouchDB:", error);
      }
    };
    fetchData();
  }, []);

  // Atualiza a cidade selecionada quando a prop onCidadeSelecionada mudar
  useEffect(() => {
    if (onCidadeSelecionada?.id) {
      setSelectedCity(onCidadeSelecionada.id);
    }
  }, [onCidadeSelecionada]);

  if (!dados) {
    return <p>Carregando...</p>;
  }

  const cityData = dados[selectedCity];
  const municipio = cityData?.nome || "N/A";
  const tempo_res = cityData?.["tempo-de-resposta"]?.[0]["tempo_resposta"] || "Sem dados";

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div className="informacoes-municipais p-6 bg-white rounded-lg shadow-md">
      {/* <select
        value={selectedCity}
        onChange={handleCityChange}
        className="w-full mb-6 p-3 border rounded-md bg-white text-[#231f20] border-[#034ea2] focus:ring-2 focus:ring-[#034ea2] focus:border-transparent"
      >
        {Object.keys(dados).map(cityCode => (
          <option key={cityCode} value={cityCode}>
            {dados[cityCode].nome}
          </option>
        ))}
      </select> */}

      <ul className="space-y-6">
        <li>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="text-[#034ea2]" />
              <p className="font-medium text-[#231f20]">Município</p>
            </div>
            <p className="text-[#034ea2] font-semibold">{municipio}</p>
          </div>
        </li>

        <li>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Building2 className="text-[#034ea2]" />
              <p className="font-medium text-[#231f20]">Tempo de Resposta</p>
            </div>
            <p className="text-[#034ea2] font-semibold">{tempo_res}</p>
          </div>
        </li>
      </ul>

      <div className="mt-6 space-y-4">
        <TemposAnalise selectedCity={selectedCity} />

        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="treemap" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <LandPlot className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">Distribuição de Atividades</span>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <TreeMap selectedCity={selectedCity} dados={dados} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="piecharts" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <LandPlot className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">Gráficos de Distribuição</span>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <div className="w-full">
                <PieCharts selectedCity={selectedCity} dados={dados} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
