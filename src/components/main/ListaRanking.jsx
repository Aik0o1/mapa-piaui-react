import { useState, useEffect } from "react";
import { 
  MapPin, 
  Building2, 
  FileChartPie,
  CheckCircle,
  Percent,
  Clock
} from "lucide-react";
import { 
  AccordionItem, 
  Accordion, 
  AccordionTrigger, 
  AccordionContent 
} from "../ui/accordion";

export default function ListaRanking({ onCidadeSelecionada, mes, ano }) {
  const [dados, setDados] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  const meses = {
    'Janeiro': '01',
    'Fevereiro': '02',
    'Março': '03',
    'Abril': '04',
    'Maio': '05',
    'Junho': '06',
    'Julho': '07',
    'Agosto': '08',
    'Setembro': '09',
    'Outubro': '10',
    'Novembro': '11',
    'Dezembro': '12',
  };

  const id = onCidadeSelecionada.id.length > 6 
    ? onCidadeSelecionada.id.split('-')[1] 
    : onCidadeSelecionada.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";
        const numero_mes = meses[mes];

        if (onCidadeSelecionada?.id && mes && ano) {
          url = `http://127.0.0.1:5000/ranking?cidade=${id}&mes=${numero_mes}&ano=${ano}`;
        } else {
          url = `http://127.0.0.1:5000/ranking?cidade=2211001&mes=${numero_mes}&ano=${ano}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        
        setDados(data.ranking); // Ajuste para acessar a propriedade 'dados'

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

  const municipio = onCidadeSelecionada.nome === "Selecione um município" 
    ? "TERESINA" 
    : onCidadeSelecionada.nome;

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
              <p className="font-medium text-[#231f20]">Posição no Ranking</p>
            </div>
            <p className="text-[#034ea2] font-semibold">{dados.posicao || "N/A"}</p>
          </div>
        </li>

        <li>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-[#034ea2]" />
              <p className="font-medium text-[#231f20]">Pontuação Total</p>
            </div>
            <p className="text-[#034ea2] font-semibold">{dados.documentos_habilitados.pontuacao + dados.indice_atendimentos.pontuacao + dados.tempos_analise.pontuacao|| "N/A"}</p>
          </div>
        </li>
      </ul>

      <div className="mt-6 space-y-4">
        {/* Acordeão para Documentos Habilitados */}
        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="documentos" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <FileChartPie className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">Documentos Habilitados</span>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <ul className="space-y-2">
                {dados.documentos_habilitados && Object.entries(dados.documentos_habilitados).map(([doc, valor]) => (
                  <li key={doc} className="flex justify-between py-2 border-b last:border-b-0">
                    <span className="font-medium">{doc.toUpperCase()}:</span>
                    <span className="text-[#034ea2]">{valor || "N/A"}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Acordeão para Índice de Atendimentos */}
        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="atendimentos" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <Percent className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">Índice de Atendimentos</span>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <ul className="space-y-2">
                <li className="flex justify-between py-2 border-b">
                  <span className="font-medium">Percentual:</span>
                  <span className="text-[#034ea2]">
                    {(dados.indice_atendimentos?.percentual_atendimento * 100)?.toFixed(2) + '%' || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span className="font-medium">Quantidade de Atendimentos:</span>
                  <span className="text-[#034ea2]">
                    {dados.indice_atendimentos?.qtd_atendimentos || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span className="font-medium">Solicitações:</span>
                  <span className="text-[#034ea2]">
                    {dados.indice_atendimentos?.qtd_solicitacoes || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between py-2">
                  <span className="font-medium">Pontuação:</span>
                  <span className="text-[#034ea2]">
                    {dados.indice_atendimentos?.pontuacao || "N/A"}
                  </span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Acordeão para Tempos de Análise */}
        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="tempos" className="border-none">
            <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
              <Clock className="h-5 w-5 text-[#034ea2]" />
              <span className="font-medium">Tempos de Análise</span>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <ul className="space-y-2">
                {dados.tempos_analise && Object.entries(dados.tempos_analise).map(([tipo, tempo]) => (
                  tipo !== 'pontuacao' && (
                    <li key={tipo} className="flex justify-between py-2 border-b last:border-b-0">
                      <span className="font-medium">{tipo.toUpperCase()}:</span>
                      <span className="text-[#034ea2]">{tempo || "N/A"}</span>
                    </li>
                  )
                ))}
                <li className="flex justify-between py-2 border-t mt-2">
                  <span className="font-medium">Pontuação:</span>
                  <span className="text-[#034ea2] font-semibold">
                    {dados.tempos_analise?.pontuacao || "N/A"}
                  </span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}