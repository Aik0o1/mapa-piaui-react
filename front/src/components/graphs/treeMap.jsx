import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function HierarchicalTreeMap({ secoesData, title }) {
  const svgRef = useRef();
  
  useEffect(() => {
    if (!secoesData) return;
    
    console.log("Dados para TreeMap Hierárquico:", secoesData);
    
    // Limpa o SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 1400;
    const height = 700;

    // Função para criar children a partir dos dados de cada setor
    const createChildren = (data, parentName) => {
      if (!data || !Array.isArray(data)) return [];
      return data
        .filter((item) => item.value !== null && item.value > 0)
        .map((item) => ({
          name: item.label,
          value: item.value,
          parent: parentName
        }));
    };

    // Prepara os setores
    const sectorsData = [
      {
          name: "Comércio",
          color: "#16a34a",
          children: createChildren(secoesData.comercio, "Comércio")
        },
        {
          name: "Serviços",
          color: "#2563eb",
          children: createChildren(secoesData.servico, "Serviços")
        },
        {
          name: "Indústria",
          color: "#ea580c",
          children: createChildren(secoesData.industria, "Indústria")
        },
        {
          name: "Sem Classificação",
          color: "#6b7280",
          children: createChildren(secoesData["-"], "Sem Classificação")
        }
    ].filter(setor => setor.children.length > 0);

    
    // Se não houver dados, não renderiza
    if (sectorsData.length === 0) return;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Calcula a largura de cada setor
    const sectorWidth = width / sectorsData.length;

    // Função para obter a cor baseada no setor pai (sem variação)
    const getColor = (baseColor, index, total) => {
      return baseColor;
    };

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "12px 16px")
      .style("border-radius", "8px")
      .style("visibility", "hidden")
      .style("font-size", "14px")
      .style("z-index", "1000")
      .style("box-shadow", "0 4px 6px rgba(0,0,0,0.3)");

    // Renderiza cada setor separadamente
    sectorsData.forEach((sector, sectorIndex) => {
      const xOffset = sectorIndex * sectorWidth;
      
      // Cria hierarquia para o setor
      const sectorRoot = d3.hierarchy({
        name: sector.name,
        children: sector.children
      })
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);

      // Cria treemap para o setor
      const treemap = d3.treemap()
        .size([sectorWidth - 4, height])
        .padding(2)
        .round(true);

      treemap(sectorRoot);

      // Pega apenas as folhas (atividades)
      const leaves = sectorRoot.leaves();

      // Cria grupo para o setor
      const sectorGroup = svg.append("g")
        .attr("transform", `translate(${xOffset}, 0)`);

      const cell = sectorGroup
        .selectAll("g")
        .data(leaves)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      cell
        .append("rect")
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("fill", (d, i) => getColor(sector.color, i, leaves.length))
        .attr("opacity", 0.85)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);

      // Adiciona texto
      cell.each(function(d) {
        const rectWidth = d.x1 - d.x0;
        const rectHeight = d.y1 - d.y0;
        const cellGroup = d3.select(this);

        // Calcula tamanhos de fonte apropriados
        const minDimension = Math.min(rectWidth, rectHeight);
        const labelFontSize = Math.max(10, Math.min(14, minDimension / 8));
        const valueFontSize = Math.max(16, Math.min(24, minDimension / 4));

        // Nome da atividade
        const displayName = d.data.name;
        
        // Quebra o texto em palavras
        const words = displayName.split(/[,\s]+/);
        const maxCharsPerLine = Math.floor(rectWidth / (labelFontSize * 0.70));

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
              lines.push(word.substring(0, maxCharsPerLine - 3) + "...");
            }
          }
        });
        if (currentLine) lines.push(currentLine);

        // Calcula espaço disponível para o título (reserva espaço para o valor)
        const lineHeight = labelFontSize + 3;
        const valueHeight = valueFontSize + 24; // altura do valor + margem
        const availableHeightForTitle = rectHeight - valueHeight;
        const maxLines = Math.floor(availableHeightForTitle / lineHeight);
        const finalLines = lines.slice(0, Math.max(0, maxLines));

        // Adiciona as linhas de texto (com clipPath para evitar overflow)
        const clipId = `clip-${Math.random().toString(36).substr(2, 9)}`;
        
        cellGroup
          .append("clipPath")
          .attr("id", clipId)
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", rectWidth)
          .attr("height", rectHeight);

        const textGroup = cellGroup.append("g")
          .attr("clip-path", `url(#${clipId})`);

        finalLines.forEach((line, i) => {
          textGroup
            .append("text")
            .attr("x", 8)
            .attr("y", 18 + (i * lineHeight))
            .attr("text-anchor", "start")
            .attr("fill", "white")
            .style("font-size", `${labelFontSize}px`)
            .style("font-weight", "600")
            .style("text-transform", "uppercase")
            .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.7)")
            .text(line);
        });

        // Adiciona o valor (sempre visível, posicionado no final do retângulo)
        if (d.value) {
          textGroup
            .append("text")
            .attr("x", 8) 
            .attr("y", rectHeight - 10) // Posiciona próximo ao final do retângulo
            .attr("text-anchor", "start")
            .attr("fill", "#FFFFFF")
            .style("font-size", `${valueFontSize}px`)
            .style("font-weight", "bold")
            .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.8)")
            .text(d.value.toLocaleString('pt-BR'));
        }
      });

      // Adiciona interação de tooltip
      cell
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget).select("rect").attr("opacity", 1);
          
          tooltip
            .style("visibility", "visible")
            .html(
              `<strong style="color: #FFD700; font-size: 11px;">${sector.name}</strong><br>
               <strong style="color: #FFF; font-size: 15px;">${d.data.name}</strong><br>
               <span style="font-size: 16px; margin-top: 6px; display: block;">Empresas: <strong style="color: #FFD700;">${d.value.toLocaleString('pt-BR')}</strong></span>`
            );
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", `${event.pageY + 15}px`)
            .style("left", `${event.pageX + 15}px`);
        })
        .on("mouseout", (event) => {
          d3.select(event.currentTarget).select("rect").attr("opacity", 0.85);
          tooltip.style("visibility", "hidden");
        });
    });

    // Cleanup
    return () => {
      d3.select("body").selectAll("div").filter(function() {
        return d3.select(this).style("position") === "absolute" &&
               d3.select(this).style("background").includes("rgba(0, 0, 0, 0.9)");
      }).remove();
    };
  }, [secoesData]);

  return (
    <div className="w-full">
      <div className="">
        <div className="overflow-hidden">
          <svg ref={svgRef} style={{ width: "100%" }}></svg>
        </div>
      </div>
    </div>
  );
}