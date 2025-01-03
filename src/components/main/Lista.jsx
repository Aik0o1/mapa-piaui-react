import React from "react";
import { MapPin, Building2, Clock2 } from "lucide-react";

export default function Lista({ dadosRecebidos, selectedCity }) {
  if (!dadosRecebidos) {
    return <p>Selecione uma cidade, mês e ano para visualizar os dados.</p>;
  }

  // if (!selectedCity) {
  //   return <p>Selecione uma cidade para visualizar os dados.</p>;
  // }

  const { cidade, dados } = dadosRecebidos;

  // Valores extraídos dos dados
  const municipio = dados.nome || "N/A";
  const qtdAbertas = dados.abertura?.[0]?.qtd_abertas_no_mes || "Sem dados";
  const tempoResposta = dados["tempo-de-resposta"]?.[0]?.tempo_resposta || "Sem dados";

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
              <p className="font-medium text-[#231f20]">Empresas Abertas</p>
            </div>
            <p className="text-[#034ea2] font-semibold">{qtdAbertas}</p>
          </div>
        </li>
        <li>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Clock2 className="text-[#034ea2]" />
              <p className="font-medium text-[#231f20]">Tempo de Resposta</p>
            </div>
            <p className="text-[#034ea2] font-semibold">{tempoResposta}</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
