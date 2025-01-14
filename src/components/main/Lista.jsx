import React, { useState, useEffect } from "react";
import { MapPin, Building2, LandPlot, Clock2, FileChartPie } from "lucide-react";
import TemposAnalise from './TemposAnalise';
import TreeMap from "../graphs/treeMap";
import PieCharts from "../graphs/PieCharts";
import { AccordionItem, Accordion, AccordionTrigger, AccordionContent } from "../ui/accordion";
export default function Lista({ onCidadeSelecionada, mes, ano }) {
  const [dados, setDados] = useState(null);
  // console.log(dados);

  const [selectedCity, setSelectedCity] = useState("");
  const meses = {
    'Janeiro': 1,
    'Fevereiro': 2,
    'Março': 3,
    'Abril': 4,
    'Maio': 5,
    'Junho': 6,
    'Julho': 7,
    'Agosto': 8,
    'Setembro': 9,
    'Outubro': 10,
    'Novembro': 11,
    'Dezembro': 12,
  };

  const id = onCidadeSelecionada.id.length > 6 ? onCidadeSelecionada.id.split('-')[1] : onCidadeSelecionada.id

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";

        if (onCidadeSelecionada?.id && mes && ano) {
          const numero_mes = meses[mes];
          url = `http://10.40.25.210:5000/buscar_dados?cidade=${id}&mes=${numero_mes}&ano=${ano}`;
        } else if (mes && ano) {
          const numero_mes = meses[mes];
          url = `http://10.40.25.210:5000/buscar_todas?mes=${numero_mes}&ano=${ano}`;
        } else {
          url = `http://10.40.25.210:5000/buscar_todas`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setDados(data);

        if (onCidadeSelecionada?.id) {
          setSelectedCity(onCidadeSelecionada.id);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do servidor:", error);
      }
    };

    fetchData();
  }, [onCidadeSelecionada, mes, ano]);

  if (!dados) {
    return <p>Carregando...</p>;
  }

  // console.log(id);

  // console.log(cidadeNoMapa)
  //const dados = dados[cidadeNoMapa];
  const municipio = dados?.nome || "N/A";
  const tempo_res = dados?.["tempo-de-resposta"]?.[0]["tempo_resposta"] || "Sem dados";
  const qtd_abertas = dados?.["abertura"]?.[0]["qtd_abertas_no_mes"] || "N/A";


  return (
    <div className="informacoes-municipais p-6 bg-white rounded-lg shadow-md">

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
              <p className="font-medium text-[#231f20]">Quantidade de empresas abertas</p>
            </div>
            <p className="text-[#034ea2] font-semibold">{qtd_abertas}</p>
          </div>
        </li>

        <li>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Clock2 className="text-[#034ea2]" />
              <p className="font-medium text-[#231f20]">Tempo de Resposta</p>
            </div>
            <p className="text-[#034ea2] font-semibold">{tempo_res}</p>
          </div>
        </li>
      </ul>

      <div className="mt-6 space-y-4">
        <TemposAnalise dados={dados} />

        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="treemap" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <LandPlot className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">Empresas abertas por atividades</span>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <TreeMap selectedCity={id} dados={dados} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="piecharts" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <FileChartPie className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">Empresas abertas por porte e natureza</span>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <div className="w-full">
                <PieCharts selectedCity={id} dados={dados} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};