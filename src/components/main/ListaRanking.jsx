import { useState, useEffect } from "react";
import {
  MapPin,
  FileText,
  CheckCircle,
  Percent,
  ListTodo,
  SquareCheckBig,
  LaptopMinimalCheck,
  Trophy,
  Clock,
} from "lucide-react";
import {
  AccordionItem,
  Accordion,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";

export default function ListaRanking({ onCidadeSelecionada, mes, ano }) {
  const [dados, setDados] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // const toggleAccordion = (key) => {
  //   setOpenAccordions((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //   }));
  // };

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
      try {
        // setLoading(true);

        const numero_mes = meses[mes];
        const id =
          onCidadeSelecionada.id.length > 6
            ? onCidadeSelecionada.id.split("-")[1]
            : onCidadeSelecionada.id;

        const url = onCidadeSelecionada?.id
          ? `${import.meta.env.VITE_URL}/ranking?cidade=${id}&mes=${numero_mes}&ano=${ano}`
          : `${import.meta.env.VITE_URL}/ranking?cidade=2211001&mes=${numero_mes}&ano=${ano}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization" : `Bearer ${import.meta.env.VITE_API_TOKEN}`
          }
        });
        const data = await response.json();

        if (!response.ok || !data.ranking) {
          setDados(null);
        } else {
          setDados(data.ranking);
        }
      } catch (err) {
        setError(err.message);
        // console.error("Erro:", err);
      }
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchData();
  }, [onCidadeSelecionada, mes, ano]);

  const municipio =
    onCidadeSelecionada?.nome === "Selecione um município"
      ? "TERESINA"
      : onCidadeSelecionada?.nome || "TERESINA";

  const documentLabels = {
    al: "Alvará de Localização",
    as: "Alvará Sanitário",
    cp: "Consulta Prévia",
    im: "Inscrição Municipal",
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return null;

    // Se já estiver no formato hh:mm:ss
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
      return timeStr;
    }

    // Tentar extrair tempo de strings complexas
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2}):(\d{2})/);
    if (timeMatch) {
      const hours = timeMatch[1].padStart(2, "0");
      return `${hours}:${timeMatch[2]}:${timeMatch[3]}`;
    }

    return null;
  };

  // const formatTime = (timeString) => {
  //   if (!timeString || timeString === "0:00:00") return "0:00:00";
  //   return timeString.split(".")[0]; // Remove microseconds
  // };

  // if (loading) {
  //   return (
  //     <div className="informacoes-municipais p-6 bg-white rounded-lg shadow-md">
  //       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
  //         <div className="flex items-center gap-3">
  //           <MapPin className="text-[#034ea2]" />
  //           <p className="font-medium text-[#231f20]">Município</p>
  //         </div>
  //         <p className="text-[#034ea2] font-semibold">{municipio}</p>
  //       </div>
  //       <div className="mt-6 space-y-4">
  //         <p>Carregando dados...</p>
  //       </div>
  //     </div>
  //   );
  // }

  const totalPontuacao =
    (dados?.documentos_habilitados?.pontuacao || 0) +
    (dados?.indice_atendimentos?.pontuacao || 0) +
    (dados?.tempos_analise?.pontuacao || 0);

  return (
    <div className="informacoes-municipais p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        {/* Nome do município */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <MapPin className="text-[#034ea2]" />
            <p className="font-medium text-[#231f20]">Município</p>
          </div>
          <p className="text-[#034ea2] font-semibold">{municipio}</p>
        </div>

        {/* Posição no Ranking */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <Trophy className="text-[#034ea2]" />
            <p className="font-medium text-[#231f20]">Posição</p>
          </div>
          <p className="text-[#034ea2] font-semibold">
            {dados?.posicao || "-"}
          </p>
        </div>

        {/* Pontuação Total - Accordion */}
        <Accordion
          type="single"
          collapsible
          className="w-full border rounded-lg"
        >
          <AccordionItem value="pontuacao-total" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <CheckCircle className="h-5 w-5 text-[#034ea2]" />
              <div className="flex justify-between items-center w-full">
                <span className="font-medium">Pontuação Total</span>
                <span className="font-bold text-[#034ea2]">
                  {totalPontuacao == 0 ? "" : totalPontuacao}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-4 pt-0">
              <ul className="space-y-2">
                <li className="flex justify-between py-2 border-b">
                  <span className="font-medium">Documentos Habilitados</span>
                  <span className="text-[#034ea2]">
                    {dados?.documentos_habilitados?.pontuacao ?? "-"}
                  </span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span className="font-medium">Índice de atendimento</span>
                  <span className="text-[#034ea2]">
                    {dados?.indice_atendimentos?.pontuacao ?? "-"}
                  </span>
                </li>
                <li className="flex justify-between py-2">
                  <span className="font-medium">Tempo de análise</span>
                  <span className="text-[#034ea2]">
                    {dados?.tempos_analise?.pontuacao ?? "-"}
                  </span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Documentos Habilitados - Accordion */}
        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="documentos" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <FileText className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">Documentos Habilitados</span>
            </AccordionTrigger>

            <AccordionContent className="p-4 pt-0">
              {dados?.documentos_habilitados ? (
                <ul className="space-y-3">
                  {Object.entries(dados.documentos_habilitados)
                    .filter(([key]) => key !== "pontuacao")
                    .map(([doc, valor]) => {
                      const isEnabled = valor > 0;
                      return (
                        <li key={doc} className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              isEnabled ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${
                                isEnabled ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                          </div>
                          <span className="font-medium">
                            {documentLabels[doc] || doc.toUpperCase()}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <p className="text-gray-500">Sem dados</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Índice de Atendimento */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <LaptopMinimalCheck className="text-[#034ea2]" />
              <p className="font-medium text-[#231f20]">
                Índice de atendimento
              </p>
            </div>
          </div>

          {dados?.indice_atendimentos ? (
            <div className="px-4">
              <div className="mb-2">
                <span className="text-2xl font-bold text-[#034ea2]">
                  {(
                    dados.indice_atendimentos.percentual_atendimento * 100
                  ).toFixed(0)}
                  %
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  ({dados.indice_atendimentos.qtd_solicitacoes} solicitações /{" "}
                  {dados.indice_atendimentos.qtd_atendimentos} atendimentos)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#034ea2] h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      dados.indice_atendimentos.percentual_atendimento * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 px-4">Sem dados</p>
          )}
        </div>

        {/* Tempos de Análise - Accordion */}
        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="tempos" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <Clock className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">Tempos de análise</span>
            </AccordionTrigger>

            <AccordionContent className="p-4 pt-0">
              {dados?.tempos_analise ? (
                <ul className="space-y-2">
                  {Object.entries(dados.tempos_analise)
                    .filter(([key]) => key !== "pontuacao")
                    .map(([doc, tempo]) => (
                      <li
                        key={doc}
                        className="flex justify-between py-2 border-b last:border-b-0"
                      >
                        <span className="font-medium">
                          {documentLabels[doc]}
                        </span>
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
      </div>
    </div>
  );
}
