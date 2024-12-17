import React, { useEffect, useState } from "react";
import * as d3 from "d3";

export default function PieChart() {
    const [dados, setDados] = useState([]); // Estado para armazenar os dados

    useEffect(() => {
        d3.json("../teresina.json").then((data) => {
            const portes = data?.Portes || [];
            setDados(portes);
        });
    }, []);

    return (
        <div>
            {dados.length > 0 ? <Pie dados={dados} /> : <p>Carregando...</p>}
        </div>
    );
}

function Pie({ dados, width = 400, height = 400 }) {
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie().value((d) => d["Qtd por Porte"]); // Usa "Qtd por Porte" para definir o tamanho da fatia
    const arcs = pie(dados);

    // Escala de cores
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Gerador de caminhos (arcos)
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    return (
        <svg width={width} height={height}>
            {/* Translação para centralizar o gráfico */}
            <g transform={`translate(${width / 2}, ${height / 2})`}>
                {arcs.map((arc, index) => (
                    <g key={index}>
                        {/* Fatias */}
                        <path d={arcGenerator(arc)} fill={color(index)} />
                        {/* Labels */}
                        <text
                            transform={`translate(${arcGenerator.centroid(arc)})`}
                            textAnchor="middle"
                            fontSize="12px"
                            fill="white"
                        >
                            {arc.data.Tipo} {/* Tipo de porte */}
                        </text>
                    </g>
                ))}
            </g>
        </svg>
    );
}
