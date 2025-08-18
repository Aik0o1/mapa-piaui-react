// Salve este código como um componente, por exemplo: ChartCard.js
import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

// Componente "Puro" que apenas renderiza o SVG do gráfico
function D3PieChart({ data, width, height }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Limpa o SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    const radius = Math.min(width, height) / 2 - 20;
    const colors = d3.scaleOrdinal(d3.schemeSet3);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value((d) => d.value).sort(null);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const arcHover = d3.arc().innerRadius(0).outerRadius(radius + 8);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "chart-tooltip") // Use uma classe única para evitar conflitos
      .style("position", "absolute")
      .style("opacity", 0)
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "4px")
      .style("font-size", "13px")
      .style("pointer-events", "none")
      .style("z-index", 1000);

    const segments = svg.selectAll("path").data(pie(data)).enter().append("g");

    segments
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => colors(i))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("d", arcHover);
        const total = d3.sum(data, (d) => d.value);
        const percent = (d.data.value / total * 100).toFixed(2);
        tooltip.style("opacity", 1).html(
          `<strong>${d.data.label}</strong><br/>
           Quantidade: ${d.data.value.toLocaleString('pt-BR')}<br/>
           Percentual: ${percent}%`
        );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 15}px`)
          .style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("d", arc);
        tooltip.style("opacity", 0);
      });

    segments
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#333")
      .style("pointer-events", "none")
      .text((d) => {
        const total = d3.sum(data, (d) => d.value);
        const percent = (d.data.value / total) * 100;
        return percent >= 15 ? `${percent.toFixed(0)}%` : "";
      });

    return () => d3.selectAll(".chart-tooltip").remove();
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}

// --- Componente Principal que você vai usar ---
export default function ChartCard({
  title,
  data,
  width = 350,
  height = 280,
}) {
  const colors = d3.scaleOrdinal(d3.schemeSet3);

  // Prepara dados para a legenda usando React, não manipulação de DOM
  const legendData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const total = d3.sum(data, (d) => d.value);

    return [...data]
      .sort((a, b) => b.value - a.value)
      .map((d, i) => ({
        ...d,
        percent: (d.value / total * 100).toFixed(2),
        color: colors(i),
      }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p>Não há dados para exibir.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
        {title}
      </h3>
      <div className="flex justify-center mb-4">
        <D3PieChart data={data} width={width} height={height} />
      </div>
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Legenda</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {legendData.map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
              <div
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate" title={item.label}>
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">
                  {item.value.toLocaleString('pt-BR')} ({item.percent}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}