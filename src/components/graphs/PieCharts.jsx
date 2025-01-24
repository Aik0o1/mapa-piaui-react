import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function PieCharts({ selectedCity, dados }) {
    const svgRef1 = useRef();
    const svgRef2 = useRef();

    useEffect(() => {
        if (!dados || !dados.naturezas || !dados.portes || dados.atividades=="Sem dados") return;

        // Limpa os SVGs anteriores
        d3.select(svgRef1.current).selectAll("*").remove();
        d3.select(svgRef2.current).selectAll("*").remove();

        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2;

        // Função para quebrar texto em linhas
        const wrap = (text, width) => {
            const words = text.split(/\s+/).reverse();
            let word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null)
                    .append("tspan")
                    .attr("x", 0)
                    .attr("y", y)
                    .attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", 0)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                }
            }
        };

        // Função para criar gráfico de pizza
        const createPieChart = (data, svgRef, title) => {
            
            if (data == "Sem dados") return
            // Prepara os dados removendo o número do início
            const cleanedData = data.map(item => ({
                ...item,
                tipo: item.tipo.replace(/^\d+-/, '').replace(/-/g, ' ')
            }));

            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);

            // Adiciona título
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("y", -height / 2 + 20)
                .attr("class", "text-lg font-semibold")
                .text(title);

            // Cria o layout da pizza
            const pie = d3.pie()
                .value(d => d.value)
                .sort(null);

            // Gera os arcos
            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius - 50);

            // Arco maior para o hover
            const arcHover = d3.arc()
                .innerRadius(0)
                .outerRadius(radius - 40);

            // Escala de cores
            const color = d3.scaleOrdinal(d3.schemeCategory10);

            // Prepara os dados para o pie layout
            const pieData = pie(cleanedData.map(d => ({
                name: d.tipo,
                value: d.qtd_por_natureza || d.qtd_por_porte
            })));

            // Cria os segmentos
            const segments = svg.selectAll('path')
                .data(pieData)
                .enter()
                .append('g');

            segments.append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => color(i))
                .attr('stroke', 'white')
                .style('stroke-width', '2px')
                .style('opacity', 0.8)
                .on('mouseover', function (event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('d', arcHover)
                        .style('opacity', 1);

                    tooltip
                        .style('opacity', 1)
                        .html(`${d.data.name}<br>${d.data.value}`);
                })
                .on('mousemove', function (event) {
                    tooltip
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 10) + 'px');
                })
                .on('mouseout', function () {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('d', arc)
                        .style('opacity', 0.8);

                    tooltip.style('opacity', 0);
                });

            // Adiciona os rótulos nos segmentos
            const labels = segments.append('text')
                .attr("transform", d => {
                    const pos = arc.centroid(d);
                    // Ajusta a posição do texto para caber melhor no segmento
                    return `translate(${pos[0] * 1.1}, ${pos[1] * 1.3})`;
                })
                .attr("dy", "0em")
                .style("text-anchor", "middle")
                .style("font-size", "8px")
                .style("fill", "white")
                .style("pointer-events", "none");

            // Adiciona o nome e a porcentagem em linhas separadas
            labels.each(function(d) {
                const percent = Math.round((d.endAngle - d.startAngle) / (2 * Math.PI) * 100);
                if (percent > 3) { // Só mostra rótulos para segmentos maiores que 3%
                    const text = d3.select(this);
                    const words = d.data.name.split(' ');
                    
                    // Divide o texto em duas linhas se for muito longo
                    if (words.length > 2) {
                        const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                        const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ');
                        text.append('tspan')
                            .attr('x', 0)
                            .attr('dy', '-0.6em')
                            .text(firstLine);
                        text.append('tspan')
                            .attr('x', 0)
                            .attr('dy', '1.2em')
                            .text(secondLine);
                    } else {
                        text.append('tspan')
                            .attr('x', 0)
                            .attr('dy', '-0.3em')
                            .text(d.data.name);
                    }
                    
                    // Adiciona a porcentagem em uma nova linha
                    text.append('tspan')
                        .attr('x', 0)
                        .attr('dy', '1.2em')
                        .text(`${percent}%`);
                }
            });

            // Adiciona as legendas
            const legend = svg.selectAll('.legend')
                .data(pieData)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', (d, i) => {
                    const height = 20;
                    const offset = height * pieData.length / 2;
                    const x = radius + 30;
                    const y = i * height - offset;
                    return `translate(${x}, ${y})`;
                });

            legend.append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', (d, i) => color(i));

            legend.append('text')
                .attr('x', 20)
                .attr('y', 12)
                .text(d => {
                    const name = d.data.name;
                    const value = d.data.value;
                    return `${name} (${value})`;
                })
                .style('font-size', '12px');

            // Cria o tooltip
            const tooltip = d3.select('body').append('div')
                .attr('class', 'absolute bg-black text-white p-2 rounded opacity-0 pointer-events-none text-sm')
                .style('position', 'absolute')
                .style('pointer-events', 'none');
        };

        // Cria os dois gráficos
        createPieChart(dados.naturezas, svgRef1, "Naturezas");
        createPieChart(dados.portes, svgRef2, "Portes");

        // Cleanup
        return () => {
            d3.selectAll('.tooltip').remove();
        };
    }, [selectedCity, dados]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-h-[400px]">
            <div className="w-full h-[400px] bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-center font-medium mb-4"></h3>
                <svg ref={svgRef1}></svg>
            </div>
            <div className="w-full h-[400px] bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-center font-medium mb-4"></h3>
                <svg ref={svgRef2}></svg>
            </div>
        </div>
    );
}