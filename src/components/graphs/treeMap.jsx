import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function TreeMap({ selectedCity, dados }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!dados || !dados.atividades || dados.atividades == "Sem dados")
       return

    // Limpa o SVG anterior
    console.log(dados)
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 1000;
    const height = 600;

    // Limita a 10 atvs
    const atividadesLimitadas = dados.atividades
      .sort((a, b) => b.qtd_por_seção_da_atividade - a.qtd_por_seção_da_atividade)
      .slice(0, 10);

    const data = {
      name: "Atividades",
      children: atividadesLimitadas.map(item => ({
        name: item.tipo,
        value: item.qtd_por_seção_da_atividade
      }))
    };

    const treemap = d3.treemap()
      .size([width, height])
      .padding(1)
      .round(true);

    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    treemap(root);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const colorScale = d3.scaleOrdinal()
      .domain(data.children.map(d => d.name))
      .range(d3.schemeCategory10);

    const cell = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    cell.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => colorScale(d.data.name))
      .attr("opacity", 0.8)
      .attr("stroke", "#fff");

    // quebra linha do texto
    cell.append("text")
      .selectAll("tspan")
      .data(d => {
        const rectWidth = d.x1 - d.x0;
        const maxCharsPerLine = Math.floor(rectWidth / 8);

        const words = d.data.name.split(/[\s-]/);
        const lines = [];
        let currentLine = [];

        words.forEach(word => {
          const currentLineLength = currentLine.join(' ').length;
          if (currentLineLength + word.length + 1 <= maxCharsPerLine) {
            currentLine.push(word);
          } else {
            lines.push(currentLine.join(' '));
            currentLine = [word];
          }
        });
        if (currentLine.length) lines.push(currentLine.join(' '));

        return lines.map((text, index) => ({
          text,
          isName: true,
          lineIndex: index
        }));
      })
      .enter().append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 14 + d.lineIndex * 14)
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("text-transform", "capitalize")
      .text(d => d.text);

   
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("visibility", "hidden")
      .style("font-size", "12px");

    cell.on("mouseover", (event, d) => {
      tooltip
        .style("visibility", "visible")
        .html(`<strong>${d.data.name}</strong><br>Quantidade: ${d.data.value}`);
    })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY + 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

  }, [selectedCity, dados]);

  return (
    <div className="mt-4">
      <div className="border rounded p-4">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}