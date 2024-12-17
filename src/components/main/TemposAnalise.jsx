import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import { Clock2 } from "lucide-react";

export default function TemposAnalise() {

    const [dados, setDados] = useState(null);

    useEffect(() => {
        // Carrega o JSON usando D3 e salva no estado
        d3.json("../teresina.json").then((data) => {
            setDados(data); // Salva os dados no estado
        });
    }, []);

    if (!dados) {
        return <p>Carregando...</p>;
    }

    let tempos = dados["Tempo de Analise"].map((item, index) => (
        <li key={index}>
            <div className="indicador">
                <div className="label">
                    <p>{item.Tipo || "N/A"}</p>
                </div>
                <p className="valor">{item.tempo_analise || "N/A"}</p>
            </div>
        </li>
    ));

    return (

        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <Clock2 />
                    Tempos de Análise
                </AccordionTrigger>
                <AccordionContent>
                    {tempos}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
