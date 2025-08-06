import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function PieCharts({ dados }) {
  const svgRef1 = useRef();
  const svgRef2 = useRef();

  useEffect(() => {
    if (!dados) return;

    const naturezasObj = dados?.naturezas || {};
    const portesObj = dados?.portes || {};

    // Converte objetos em arrays e remove valores nulos
    const naturezas = Object.entries(naturezasObj)
      .filter(([, qtd]) => qtd != null)
      .map(([tipo, qtd]) => ({
        tipo: tipo.replace(/^\d{3}-\d\s+-\s+/, ""), 
        qtd_por_natureza: qtd
      }));

    const portes = Object.entries(portesObj)
      .filter(([, qtd]) => qtd != null)
      .map(([tipo, qtd]) => ({ tipo, qtd_por_porte: qtd }));

    d3.select(svgRef1.current).selectAll("*").remove();
    d3.select(svgRef2.current).selectAll("*").remove();

    const width = 350;
    const height = 280; // Reduzindo altura para dar espaço ao título separado
    const radius = Math.min(width, height) / 2 - 20;

    const createPieChart = (data, svgRef, title) => {
      if (!data || data.length === 0) return;

      const cleanedData = data.map((item) => ({
        ...item,
        tipo: item.tipo.replace(/^\d+-/, "").replace(/-/g, " "),
      }));

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const pie = d3
        .pie()
        .value((d) => d.qtd_por_natureza || d.qtd_por_porte)
        .sort(null);

      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius);

      const arcHover = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius + 8);

      const color = d3.scaleOrdinal(d3.schemeSet3);
      const pieData = pie(cleanedData);

      const segments = svg.selectAll("path").data(pieData).enter().append("g");

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "4px")
        .style("font-size", "13px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", "1000");

      // Segmentos do gráfico
      segments
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.9)
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", arcHover)
            .style("opacity", 1);

          const value = d.data.qtd_por_natureza || d.data.qtd_por_porte;
          const total = data.reduce((sum, item) => sum + (item.qtd_por_natureza || item.qtd_por_porte), 0);
          const percent = Math.round((value / total) * 100 * 100) / 100;

          tooltip
            .style("opacity", 1)
            .html(`<strong>${d.data.tipo}</strong><br>Quantidade: ${value.toLocaleString('pt-BR')}<br>Percentual: ${percent}%`);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", event.pageX + 15 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", arc)
            .style("opacity", 0.9);
          tooltip.style("opacity", 0);
        });

      // Rótulos apenas com percentual no centro dos segmentos (para segmentos grandes)
      const labels = segments
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("fill", "#333")
        .style("pointer-events", "none");

      labels.each(function (d) {
        const total = data.reduce((sum, item) => sum + (item.qtd_por_natureza || item.qtd_por_porte), 0);
        const value = d.data.qtd_por_natureza || d.data.qtd_por_porte;
        const percent = Math.round((value / total) * 100 * 100) / 100; // Duas casas decimais
        if (percent >= 15) { // Só mostra percentual para segmentos com 5% ou mais
          d3.select(this).text(`${percent}%`);
        }
      });

      return { data: cleanedData, colors: color, pieData };
    };

    const naturezasResult = createPieChart(naturezas, svgRef1, "Naturezas Jurídicas");
    const portesResult = createPieChart(portes, svgRef2, "Portes das Empresas");

    // Criar legendas
    const createLegend = (result, containerId) => {
      if (!result) return;

      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = '';

      const total = result.data.reduce((sum, d) => sum + (d.qtd_por_natureza || d.qtd_por_porte), 0);

      // Ordenar os dados do maior para o menor
      const sortedData = [...result.data]
        .map((d, i) => ({
          ...d,
          colorIndex: i,
          value: d.qtd_por_natureza || d.qtd_por_porte,
          percent: Math.round((d.qtd_por_natureza || d.qtd_por_porte) / total * 100 * 100) / 100
        }))
        .sort((a, b) => b.value - a.value);

      sortedData.forEach((d) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'flex items-center gap-3 p-2 rounded hover:bg-gray-50';

        legendItem.innerHTML = `
          <div class="w-4 h-4 rounded flex-shrink-0" style="background-color: ${result.colors(d.colorIndex)}"></div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-sm text-gray-900 truncate">${d.tipo}</div>
            <div class="text-xs text-gray-500">${d.value.toLocaleString('pt-BR')} (${d.percent}%)</div>
          </div>
        `;

        container.appendChild(legendItem);
      });
    };

    // Aguardar um pouco para garantir que os elementos estão no DOM
    setTimeout(() => {
      createLegend(naturezasResult, 'legend-naturezas');
      createLegend(portesResult, 'legend-portes');
    }, 100);

    return () => {
      d3.selectAll(".tooltip").remove();
    };
  }, [dados]);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico Naturezas */}
        <div className="p-6">
          {/* Título separado com linha */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              Naturezas Jurídicas
            </h3>
          </div>

          <div className="flex justify-center mb-4">
            <svg ref={svgRef1}></svg>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Legenda</h4>
            <div id="legend-naturezas" className="space-y-1 max-h-48 overflow-y-auto">
              {/* Legenda será inserida aqui via JavaScript */}
            </div>
          </div>
        </div>

        {/* Gráfico Portes */}
        <div className="p-6">
          {/* Título separado com linha */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              Portes das Empresas
            </h3>
          </div>

          <div className="flex justify-center mb-4">
            <svg ref={svgRef2}></svg>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Legenda</h4>
            <div id="legend-portes" className="space-y-1 max-h-48 overflow-y-auto">
              {/* Legenda será inserida aqui via JavaScript */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}