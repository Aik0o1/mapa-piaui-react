import React, { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  LandPlot,
  Clock2,
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

export default function ListaAtivas({ onCidadeSelecionada, mes, ano }) {
  const [dados, setDados] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const apiUrlInterna = import.meta.env.VITE_URL_API_INTERNA;

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

    if (btnAno) btnAno.style.visibility = "hidden";
    if (btnMes) btnMes.style.visibility = "hidden";
    if (btnLimparFiltros) btnLimparFiltros.style.visibility = "hidden";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id =
          onCidadeSelecionada.id.length > 6
            ? onCidadeSelecionada.id.split("-")[1]
            : onCidadeSelecionada.id;

        // setLoading(true);
        // setError(null);

        const numero_mes = meses[mes];
        // console.log("Mês:", numero_mes, "Ano:", ano, "Cidade:", id);

        // Corrigindo a URL - removendo o "?" extra
        const url_ativas = onCidadeSelecionada?.id
                   ? `${import.meta.env.VITE_URL}/empresas_ativas?cidade=${id}&mes=${numero_mes}&ano=${ano}`
                   : `${import.meta.env.VITE_URL}/empresas_ativas?cidade=total&mes=${numero_mes}&ano=${ano}`;
                

                const response = await fetch(url_ativas, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
                    }
                });
        const data = await response.json();

        // console.log(data);

        if (!response.ok || !data.ativas) {
          setDados(null);
        } else {
          // console.log(data);

          setDados(data.ativas);
        }
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

        // console.log("Dados recebidos:", data);

        // if (data.error) {
        //   setError(data.error);
        //   setDados(null);
        // } else {
        //   setDados(data);
        //   setError(null);
        // }

        if (onCidadeSelecionada?.id) {
          setSelectedCity(onCidadeSelecionada.id);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do servidor:", error);
      }
      //   setError(`Erro ao carregar dados: ${error.message}`);
      //   setDados(null);
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchData();
  }, [onCidadeSelecionada, mes, ano]);

  // if (loading) {
  //   return (
  //     <div className="informacoes-municipais p-6 bg-white rounded-lg shadow-md">
  //       <p className="text-center text-gray-500">Carregando...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="informacoes-municipais p-6 bg-white rounded-lg shadow-md">
  //       <p className="text-center text-red-500">Erro: {error}</p>
  //     </div>
  //   );
  // }

  // Determina o nome do município baseado no tipo de dados
  const municipio =
    onCidadeSelecionada.nome === "Selecione um município"
      ? "TOTAL GERAL"
      : onCidadeSelecionada.nome;

  // Calcula o total de empresas ativas somando todas as categorias
  const calcularTotalAtivas = () => {
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

  const qtd_ativas_no_mes = calcularTotalAtivas();

  // Verifica se há dados válidos para exibir gráficos

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
                Quantidade de empresas ativas
              </p>
            </div>
            <p className="text-[#034ea2] font-semibold">{qtd_ativas_no_mes}</p>
          </div>
        </li>
      </ul>

      <div className="mt-4 space-y-4">
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
