import React, { useState, useEffect } from "react";
import { MapPin, Building2, LandPlot, Clock2 } from "lucide-react";
import * as d3 from "d3";

export default function Lista() {
    const [dados, setDados] = useState(null);

    useEffect(() => {
        d3.json("teresina.json").then((data) => {
            setDados(data);
        });
    }, []);

    // if (!dados) {
    //     return <p>Carregando...</p>;
    // }

    const municipio = dados.municipio;
    const tempoResposta = dados["Tempo de resposta"][0].tempo_resposta || "N/A";

    let tempos = dados["Tempo de Analise"].map((item, index) => (
        <li key={index}>
            <div className="indicador">
                <div className="label">
                    <Clock2 />
                    <p>{item.Tipo || "N/A"}</p>
                </div>
                <p className="valor">{item.tempo_analise || "N/A"}</p>
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
                {tempos}
                <li>
                    <div className="indicador">
                        <div className="label">
                            <Building2 />
                            <p>Tempo de Resposta</p>
                        </div>
                        <p className="valor">{tempoResposta}</p>
                    </div>
                </li>
            </ul>
        </div>
    );
}
