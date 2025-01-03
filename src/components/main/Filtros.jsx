import { ComboboxCidades } from '../ui/combobox';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Filtros(props) {
    const [meses, setMes] = useState([
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]);

    const handleCidadeSelect = (cidade) => {
        props.onCidadeSelecionada(cidade); // Envia a cidade para o pai
        // console.log("Cidade selecionada no Filtros:", cidade);
    };

    const handleMesSelect = (mes) => {
        props.onMesSelecionado(mes); // Envia o mês para o pai
        // console.log("Mês selecionado no Filtros:", mes);
    };

    const handleAnoSelect = (ano) => {
        props.onAnoSelecionado(ano); // Envia o ano para o pai
        // console.log("Ano selecionado no Filtros:", ano);
    };

    return (
        <div className="filtros">
            <p>Selecione um município ou período</p>
            <div className="selecao">
                <ComboboxCidades onCidadeSelect={handleCidadeSelect} />
                <Select className="mes" onValueChange={handleMesSelect}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um mês" />
                    </SelectTrigger>
                    <SelectContent>
                        {meses.map((mes, index) => (
                            <SelectItem
                                key={index}
                                value={mes}
                            >
                                {mes}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select className="ano" onValueChange={handleAnoSelect}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um ano" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}