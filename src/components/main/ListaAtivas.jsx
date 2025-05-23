import React, { useState, useEffect } from "react";
import { MapPin, Building2, LandPlot, Clock2, FileChartPie } from "lucide-react";
import TemposAnalise from './TemposAnalise';
import TreeMap from "../graphs/treeMap";
import PieCharts from "../graphs/PieCharts";
import { AccordionItem, Accordion, AccordionTrigger, AccordionContent } from "../ui/accordion";
export default function ListaAtivas({ onCidadeSelecionada, mes, ano }) {
    const [dados, setDados] = useState(null);
    // console.log(dados);

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

    const id = onCidadeSelecionada.id.length > 6 ? onCidadeSelecionada.id.split('-')[1] : onCidadeSelecionada.id

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url_ativas = "";

                if (onCidadeSelecionada?.id && mes && ano) {
                    const numero_mes = meses[mes];
                    url_ativas = `https://dev-apimapa.jucepi.pi.gov.br//ativas?cidade=${id}&mes=${numero_mes}&ano=${ano}`;
                } else {
                    const numero_mes = meses[mes];
                    url_ativas = `https://dev-apimapa.jucepi.pi.gov.br//ativas?cidade=2211001&mes=${numero_mes}&ano=${ano}`;
                }

                const response = await fetch(url_ativas);
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
    const municipio = onCidadeSelecionada.nome == "Selecione um município"? "TERESINA" : onCidadeSelecionada.nome
    //   const tempo_res = dados?.["tempo-de-resposta"]?.[0]["tempo_resposta"] || "Sem dados";
    const qtd_ativas_no_mes = dados?.["ativas"] || "N/A";


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
                            <p className="font-medium text-[#231f20]">Quantidade de empresas ativas</p>
                        </div>
                        <p className="text-[#034ea2] font-semibold">{qtd_ativas_no_mes}</p>
                    </div>
                </li>

                {/* <li>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Clock2 className="text-[#034ea2]" />
              <p className="font-medium text-[#231f20]">Tempo de Resposta</p>
            </div>
            <p className="text-[#034ea2] font-semibold">{tempo_res}</p>
          </div>
        </li> */}
            </ul>

            <div className="mt-6 space-y-4">
                {/* <TemposAnalise dados={dados} /> */}

                <Accordion type="single" collapsible className="border rounded-lg">
                    <AccordionItem value="treemap" className="border-none">
                        <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
                            <LandPlot className="h-5 w-5 text-[#034ea2]" />
                            <span className="font-medium">Empresas ativas por atividades</span>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            {dados.error == "Cidade não encontrada" || dados.error == "Dados não encontrados para o mês/ano especificado" || dados.atividades == "Sem dados" ? <div>Sem dados</div> : <TreeMap selectedCity={id} dados={dados} />}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible className="border rounded-lg">
                    <AccordionItem value="piecharts" className="border-none">
                        <AccordionTrigger className="flex items-center gap-3 p-4 hover:bg-gray-50 text-[#231f20]">
                            <FileChartPie className="h-5 w-5 text-[#034ea2]" />
                            <span className="font-medium">Empresas ativas por porte e natureza</span>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <div className="w-full">
                                {dados.error == "Cidade não encontrada" || dados.error == "Dados não encontrados para o mês/ano especificado" || dados.atividades == "Sem dados" ? <div>Sem dados</div> : <PieCharts selectedCity={id} dados={dados} />}

                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};
