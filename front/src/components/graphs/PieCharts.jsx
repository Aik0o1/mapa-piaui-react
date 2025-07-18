import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function PieCharts({ dados }) {
  const svgRef1 = useRef();
  const svgRef2 = useRef();

  useEffect(() => {
    if (!dados) return;

    const naturezasObj = dados.abertas?.naturezas || {};
    const portesObj = dados.abertas?.portes || {};

    // console.log(naturezasObj);
    // console.log(portesObj);

    // Converte objetos em arrays e remove valores nulos
    const naturezas = Object.entries(naturezasObj)
      .filter(([, qtd]) => qtd != null)
      .map(([tipo, qtd]) => ({ tipo, qtd_por_natureza: qtd }));

    const portes = Object.entries(portesObj)
      .filter(([, qtd]) => qtd != null)
      .map(([tipo, qtd]) => ({ tipo, qtd_por_porte: qtd }));

    d3.select(svgRef1.current).selectAll("*").remove();
    d3.select(svgRef2.current).selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

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

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", -height / 2 + 20)
        .attr("class", "text-lg font-semibold")
        .text(title);

      const pie = d3
        .pie()
        .value((d) => d.qtd_por_natureza || d.qtd_por_porte)
        .sort(null);

      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius - 50);
      const arcHover = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius - 40);
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const pieData = pie(cleanedData);

      const segments = svg.selectAll("path").data(pieData).enter().append("g");

      const tooltip = d3
        .select("body")
        .append("div")
        .attr(
          "class",
          "absolute bg-black text-white p-2 rounded opacity-0 pointer-events-none text-sm"
        )
        .style("position", "absolute")
        .style("pointer-events", "none");

      segments
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.8)
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", arcHover)
            .style("opacity", 1);
          tooltip
            .style("opacity", 1)
            .html(
              `${d.data.tipo}<br>${
                d.data.qtd_por_natureza || d.data.qtd_por_porte
              }`
            );
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", arc)
            .style("opacity", 0.8);
          tooltip.style("opacity", 0);
        });

      // Rótulos
      const labels = segments
        .append("text")
        .attr("transform", (d) => {
          const pos = arc.centroid(d);
          return `translate(${pos[0] * 1.1}, ${pos[1] * 1.3})`;
        })
        .attr("dy", "0em")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .style("fill", "white")
        .style("pointer-events", "none");

      labels.each(function (d) {
        const percent = Math.round(
          ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
        );
        if (percent > 3) {
          const text = d3.select(this);
          const words = d.data.tipo.split(" ");
          if (words.length > 2) {
            const firstLine = words
              .slice(0, Math.ceil(words.length / 2))
              .join(" ");
            const secondLine = words
              .slice(Math.ceil(words.length / 2))
              .join(" ");
            text
              .append("tspan")
              .attr("x", 0)
              .attr("dy", "-0.6em")
              .text(firstLine);
            text
              .append("tspan")
              .attr("x", 0)
              .attr("dy", "1.2em")
              .text(secondLine);
          } else {
            text
              .append("tspan")
              .attr("x", 0)
              .attr("dy", "-0.3em")
              .text(d.data.tipo);
          }
          text
            .append("tspan")
            .attr("x", 0)
            .attr("dy", "1.2em")
            .text(`${percent}%`);
        }
      });

      const legend = svg
        .selectAll(".legend")
        .data(pieData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => {
          const height = 20;
          const offset = (height * pieData.length) / 2;
          const x = radius + 30;
          const y = i * height - offset;
          return `translate(${x}, ${y})`;
        });

      legend
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", (d, i) => color(i));

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(
          (d) =>
            `${d.data.tipo} (${
              d.data.qtd_por_natureza || d.data.qtd_por_porte
            })`
        )
        .style("font-size", "12px");
    };

    createPieChart(naturezas, svgRef1, "Naturezas");
    createPieChart(portes, svgRef2, "Portes");

    return () => {
      d3.selectAll(".tooltip").remove();
    };
  }, [dados]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-h-[400px]">
      <div className="w-full h-[400px] bg-white rounded-lg p-4 shadow-sm">
        <svg ref={svgRef1}></svg>
      </div>
      <div className="w-full h-[400px] bg-white rounded-lg p-4 shadow-sm">
        <svg ref={svgRef2}></svg>
      </div>
    </div>
  );
}
