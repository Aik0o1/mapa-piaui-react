import React, { useState, useEffect } from "react";
import { MapPin, Building2, LandPlot, Clock2 } from "lucide-react";
import * as d3 from "d3";
import TemposAnalise from "./TemposAnalise";
import GraficoNatureza from "./GraficoPorte";

export default function Lista() {
    const [dados, setDados] = useState(null);

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

    if (!dados) {
        return <p>Carregando...</p>;
    }

    const municipio = dados[0].nome;
    const tempo_res = dados[0].tempo_resposta || "N/A";

    let tempos_analise = dados[0].tempo_analise.map((item, index) => (
        <li key={index}>
            <div className="indicador">
                <div className="label">
                    <Clock2 />
                    <p>{item['tipo'] || "N/A"}</p>
                </div>
                <p className="valor">{item['valor'] || "N/A"}</p>
            </div>
        </li>
    ));

    return (
        <div className="informacoes-municipais">
            <ul>
                <li>
                    <div className="indicador">
                        <div className="label">
                            <MapPin />
                            <p>Município</p>
                        </div>
                        <p className="valor">{municipio}</p>
                    </div>
                </li>
                {tempos_analise}
                <li>
                    <div className="indicador">
                        <div className="label">
                            <Building2 />
                            <p>Tempo de Resposta</p>
                        </div>
                        {/* <p className="valor">{tempo_res}</p> */}
                    </div>
                </li>

                <TemposAnalise />
                {/* <GraficoNatureza /> */}

            </ul>
        </div>
    );
}
