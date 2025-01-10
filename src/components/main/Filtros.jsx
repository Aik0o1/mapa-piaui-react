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

    const [selectedMes, setSelectedMes] = useState(props.selectedMonth);
    const [selectedAno, setSelectedAno] = useState(props.selectedYear);
    const [selectedCidade, setSelectedCidade] = useState(props.cidadeSelecionada);
    


    const handleCidadeSelect = (cidade) => {
        props.onCidadeSelecionada(cidade);
    };

    const handleMesSelect = (mes) => {
        setSelectedMes(mes);
        props.onMesSelecionado(mes);
    };

    const handleAnoSelect = (ano) => {
        setSelectedAno(ano);
        props.onAnoSelecionado(ano);
    };

    const limparFiltros = () => {
        setSelectedMes("");
        setSelectedAno("");
        setSelectedCidade("")
        props.onMesSelecionado("Selecione um mês");
        props.onAnoSelecionado("Selecione um ano");
        props.onCidadeSelecionada({nome:"Selecione um município", id:""});

    }

    return (
        <div className="filtros text-[#034ea2]">
            <p>Selecione um município ou período</p>
            <div className="selecao">
                <ComboboxCidades onCidadeSelect={handleCidadeSelect} cidadeSelecionada={props.cidadeSelecionada} />
                <Select 
                    className="ano" 
                    onValueChange={handleAnoSelect}
                    value={selectedAno}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um ano" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>

                    </SelectContent>
                </Select>
                <Select 
                    className="mes" 
                    onValueChange={handleMesSelect}
                    value={selectedMes}
                >
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
                <Button
                    className=""
                    variant="outline"
                    onClick={limparFiltros}
                >
                    Limpar Filtros
                </Button>
            </div>
        </div>
    );
}