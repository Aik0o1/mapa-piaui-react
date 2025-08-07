import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TreeMap({ selectedCity, dados }) {
  const svgRef = useRef();
  useEffect(() => {
    if (!dados) return;

    // Limpa o SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 1000;
    const height = 600;

    const atividadesObj = dados?.secoes_atividades || {};

    const atividadesLimitadas = Object.entries(atividadesObj)
      .filter(([_, valor]) => valor !== null && valor !== 0)
      .map(([tipo, qtd]) => ({
        tipo,
        qtd_por_seção_da_atividade: qtd,
      }))
      .sort(
        (a, b) => b.qtd_por_seção_da_atividade - a.qtd_por_seção_da_atividade
      )
      .slice(0, 10);

    const data = {
      name: "Atividades",
      children: atividadesLimitadas.map((item) => ({
        name: item.tipo,
        value: item.qtd_por_seção_da_atividade,
      })),
    };

    const treemap = d3.treemap().size([width, height]).padding(1).round(true);

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    treemap(root);

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const colorScale = d3
      .scaleOrdinal()
      .domain(data.children.map((d) => d.name))
      .range(d3.schemeCategory10);

    const cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    cell
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => colorScale(d.data.name))
      .attr("opacity", 0.8)
      .attr("stroke", "#fff");

    // Adiciona texto do nome da atividade
    cell.each(function(d) {
      const rectWidth = d.x1 - d.x0;
      const rectHeight = d.y1 - d.y0;
      const cellGroup = d3.select(this);

      // Calcula tamanhos de fonte apropriados
      const minDimension = Math.min(rectWidth, rectHeight);
      const labelFontSize = Math.max(10, Math.min(14, minDimension / 8));
      const valueFontSize = Math.max(16, Math.min(28, minDimension / 4));

      // Quebra o texto do nome em palavras
      const words = d.data.name.split(/[-_\s]+/);
      const maxCharsPerLine = Math.floor(rectWidth / (labelFontSize * 0.7));

      // Agrupa palavras em linhas
      const lines = [];
      let currentLine = "";

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= maxCharsPerLine) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            // Palavra muito longa, trunca
            lines.push(word.substring(0, maxCharsPerLine - 3) + "...");
          }
        }
      });
      if (currentLine) lines.push(currentLine);

      // Limita o número de linhas baseado na altura disponível
      const lineHeight = labelFontSize + 2;
      const maxLines = Math.floor((rectHeight - valueFontSize - 20) / lineHeight);
      const finalLines = lines.slice(0, Math.max(1, maxLines));

      // Adiciona as linhas de texto do nome
      const textGroup = cellGroup.append("g");

      finalLines.forEach((line, i) => {
        textGroup
          .append("text")
          .attr("x", 5)
          .attr("y", 15 + (i * lineHeight))
          .attr("text-anchor", "start")
          .attr("fill", "white")
          .style("font-size", `${labelFontSize}px`)
          .style("font-weight", "bold")
          .style("text-transform", "capitalize")
          .text(line);
      });

      // Adiciona o número (valor) bem destacado
// Adiciona o número (valor) bem destacado logo abaixo das linhas de texto
textGroup
  .append("text")
  .attr("x", 5) 
  .attr("y", 15 + (finalLines.length * lineHeight) + 15) 
  .attr("text-anchor", "start")
  .attr("fill", "#FFFFFF")
  .style("font-size", `${valueFontSize}px`)
  .style("font-weight", "bold")
  .style("text-shadow", "0px 0px 1px rgba(0,0,0,0.8)")
  .text(d.data.value);

    });

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("visibility", "hidden")
      .style("font-size", "14px")
      .style("z-index", "1000")

    cell
      .on("mouseover", (event, d) => {
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong style="color: #FFD700;">${d.data.name}</strong><br>
             <span style="font-size: 16px;">Quantidade: <strong style="color: #FFD700;">${d.data.value}</strong></span>`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY + 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Cleanup do tooltip quando o componente for desmontado
    return () => {
      d3.select("body").selectAll("div").filter(function() {
        return d3.select(this).style("position") === "absolute" &&
               d3.select(this).style("background").includes("rgba(0, 0, 0, 0.9)");
      }).remove();
    };
  }, [selectedCity, dados]);

  return (
    <div className="mt-4">
      <div className="border rounded p-4">
        <svg ref={svgRef} style={{ width: "100%", height: "auto" }}></svg>
      </div>
    </div>
  );
}

