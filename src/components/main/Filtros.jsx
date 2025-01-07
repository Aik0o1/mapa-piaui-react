import { ComboboxCidades } from '../ui/combobox';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '../ui/button';

export default function Filtros(props) {
    const [meses, setMes] = useState([
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]);

    const handleCidadeSelect = (cidade) => {
        props.onCidadeSelecionada(cidade); // Envia a cidade para o pai
    };

    const handleMesSelect = (mes) => {
        props.onMesSelecionado(mes); // Envia o mês para o pai
    };

    const handleAnoSelect = (ano) => {
        props.onAnoSelecionado(ano); // Envia o ano para o pai
    };

    const limparFiltros = () => {
        props.onMesSelecionado("Selecione um mês")
        props.onAnoSelecionado("Selecione um ano")
        console.log(props.selectedMonth)
    }

    return (
        <div className="filtros text-[#034ea2] ">
            <p>Selecione um município ou período</p>
            <div className="selecao">
                <ComboboxCidades onCidadeSelect={handleCidadeSelect} cidadeSelecionada={props.cidadeSelecionada} />
                <Select className="ano" onValueChange={handleAnoSelect}>
                    <SelectTrigger>
                        <SelectValue placeholder={props.selectedYear} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                </Select>
                <Select className="mes" onValueChange={handleMesSelect}>
                    <SelectTrigger>
                        <SelectValue placeholder={props.selectedMonth} />
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
                <Button
                    className=""
                    variant="outline"
                    onClick={limparFiltros}
                >Limpar Filtros
                </Button>

            </div>
        </div>
    );
}