import React, { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  LandPlot,
  Clock2,
  Clock,
  FileChartPie,
} from "lucide-react";
import TemposAnalise from "./TemposAnalise";
import TreeMap from "../graphs/treeMap";
import PieCharts from "../graphs/PieCharts";
import {
  AccordionItem,
  Accordion,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
export default function Lista({ onCidadeSelecionada, mes, ano }) {
  const [dados, setDados] = useState(null);
  // console.log(dados);

  const apiUrlExterna = import.meta.env.VITE_URL_API_EXTERNA;

  const [selectedCity, setSelectedCity] = useState("");
  const meses = {
    Janeiro: "01",
    Fevereiro: "02",
    Março: "03",
    Abril: "04",
    Maio: "05",
    Junho: "06",
    Julho: "07",
    Agosto: "08",
    Setembro: "09",
    Outubro: "10",
    Novembro: "11",
    Dezembro: "12",
  };

  useEffect(() => {
    const btnAno = document.getElementsByClassName("anoEscolha")[0];
    const btnMes = document.getElementsByClassName("mesEscolha")[0];
    const btnLimparFiltros =
      document.getElementsByClassName("limpar-filtros")[0];

    btnAno.style.visibility = "visible";
    btnMes.style.visibility = "visible";
    btnLimparFiltros.style.visibility = "visible";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // console.log(dados);

      try {
        // let url = "";

        // if (onCidadeSelecionada) {
        const numero_mes = meses[mes];
        const id =
          onCidadeSelecionada.id.length > 6
            ? onCidadeSelecionada.id.split("-")[1]
            : onCidadeSelecionada.id;
        //   url = `http://localhost:5000/municipios?cidade=${id}&mes=${numero_mes}&ano=${ano}`;
        // } else {
        //   const numero_mes = meses[mes];
        //   url = `http://localhost:5000/municipios?cidade=2211001&mes=${numero_mes}&ano=${ano}`;
        // }

        const url = onCidadeSelecionada?.id
          ? `${apiUrlExterna}/ranking?cidade=${id}&mes=${numero_mes}&ano=${ano}`
          : `${apiUrlExterna}/ranking?cidade=2211001&mes=${numero_mes}&ano=${ano}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.abertas) {
          setDados(null);
        } else {
          setDados(data.abertas);
        }

        if (onCidadeSelecionada?.id) {
          setSelectedCity(onCidadeSelecionada.id);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do servidor:", error);
      }
    };

    fetchData();
  }, [onCidadeSelecionada, mes, ano]);

  const municipio =
    onCidadeSelecionada.nome == "Selecione um município"
      ? "TERESINA"
      : onCidadeSelecionada.nome;

  const labels = {
    tempo_medio_tempo_de_registro:
      "Média de Tempo para Registro na Junta Comercial",
    tempo_medio_cp_end:
      "Média de Tempo para Consulta Pŕevia de Endereço junto ao Município",
    media_tempo_total_para_registro: "Média de Tempo Total para Registro",
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return null;

    // Se já estiver no formato hh:mm:ss
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
      return timeStr;
    }
  };

  const calcularTotalAbertas = () => {
    if (!dados) return "-";

    let total = 0;
    const { naturezas, portes, secoes_atividades } = dados;

    // Soma valores de naturezas (evita dupla contagem usando apenas uma categoria)
    if (naturezas && Object.keys(naturezas).length > 0) {
      Object.values(naturezas).forEach((valor) => {
        if (valor !== null && typeof valor === "number") {
          total += valor;
        }
      });
    } else if (portes && Object.keys(portes).length > 0) {
      // Se não tem naturezas, usa portes
      Object.values(portes).forEach((valor) => {
        if (valor !== null && typeof valor === "number") {
          total += valor;
        }
      });
    } else if (secoes_atividades && Object.keys(secoes_atividades).length > 0) {
      // Se não tem nem naturezas nem portes, usa seções
      Object.values(secoes_atividades).forEach((valor) => {
        if (valor !== null && typeof valor === "number") {
          total += valor;
        }
      });
    }

    return total > 0 ? total.toLocaleString("pt-BR") : "-";
  };

  const qtd_abertas = calcularTotalAbertas();

  // const qtd_abertas = totalAbertas ? totalAbertas : "-";

  return (
    <div className="informacoes-municipais p-6 bg-white rounded-lg shadow-md">
      <ul className="space-y-4">
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
              <p className="font-medium text-[#231f20]">
                Quantidade de empresas abertas
              </p>
            </div>
            <p className="text-[#034ea2] font-semibold">{qtd_abertas}</p>
          </div>
        </li>
      </ul>

      <div className="mt-4 space-y-4">
        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="tempos" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <Clock className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">Tempos de Análise</span>
            </AccordionTrigger>

            <AccordionContent className="p-4 pt-0">
              {dados?.tempos ? (
                <ul className="space-y-2">
                  {Object.entries(dados.tempos)
                    .filter(([key]) => key in labels)
                    .sort(([, tempoA], [, tempoB]) => {
                      const toSeconds = (t) => {
                        if (!t) return Infinity;
                        const [h, m, s] = t.split(":").map(Number);
                        return (h ?? 0) * 3600 + (m ?? 0) * 60 + (s ?? 0);
                      };
                      return toSeconds(tempoA) - toSeconds(tempoB);
                    })
                    .map(([doc, tempo]) => (
                      <li
                        key={doc}
                        className="flex justify-between py-2 border-b last:border-b-0"
                      >
                        <span className="font-medium">{labels[doc]}</span>
                        <span className="text-[#034ea2] font-mono">
                          {tempo ? formatTime(tempo) : "-"}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500">Sem dados</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="treemap" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <LandPlot className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">
                Empresas abertas por atividades
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              {dados == null ? (
                <p className="text-gray-500">Sem dados</p>
              ) : (
                <TreeMap dados={dados} />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="piecharts" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <FileChartPie className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">
                Empresas abertas por porte e natureza jurídica
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <div className="w-full">
                {dados == null ? (
                  <p className="text-gray-500">Sem dados</p>
                ) : (
                  <PieCharts dados={dados} />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
