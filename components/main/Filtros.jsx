
import { useEffect } from 'react';
import { ComboboxCidades } from '../ui/combobox';
import { useState } from 'react';
import * as d3 from 'd3';
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

    const mesesDict = {'01':'Janeiro', '02':'Fevereiro', '03':'Março', '04':'Abril', '05':'Maio', '06':'Junho',
        '07':'Julho', '08':'Agosto', '09':'Setembro', "10":'Outubro', "11":'Novembro', '12':'Dezembro'}

    const [selectedMes, setSelectedMes] = useState(props.selectedMonth);
    const [selectedAno, setSelectedAno] = useState(props.selectedYear);
    const [selectedCidade, setSelectedCidade] = useState(props.cidadeSelecionada);
    const [dataRecente, setDataRecente] = useState()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = "https://dev-apimapa.jucepi.pi.gov.br/data_recente"
                const response = await fetch(url);
                const data = await response.json();
                setDataRecente(data);
                console.log(data)
            } catch (error) {
                console.error("Erro ao buscar dados do servidor:", error);
              }
        }

        fetchData();
      }, []);

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


    const highlightCityOnMap = () => {
        const svg = d3.select("#map");
        
        svg.selectAll(".city")
          .classed("selected", false)
          .classed("no-selected", false)
          .transition()
          .duration(300)
        
      };

    const limparFiltros = () => {
        setSelectedMes(mesesDict[dataRecente.mes]);
        setSelectedAno(dataRecente.ano);
        setSelectedCidade("")

        props.onMesSelecionado(mesesDict[dataRecente.mes]);
        props.onAnoSelecionado(dataRecente.ano);
        props.onCidadeSelecionada({nome:"Selecione um município", id:""});
        highlightCityOnMap()
    }


    return (
        <div className="filtros text-[#034ea2]">
            <div className="selecao">
            <p>Selecione um município ou período</p>
                <ComboboxCidades onCidadeSelect={handleCidadeSelect} cidadeSelecionada={props.cidadeSelecionada} />
                <Select 
                    className="ano" 
                    onValueChange={handleAnoSelect}
                    value={selectedAno}
                >
                    <SelectTrigger className="w-[250px]">
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
                    <SelectTrigger className="w-[250px]">
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
                    className="w-[250px]"
                    variant="outline"
                    onClick={limparFiltros}
                >
                    Limpar Filtros
                </Button>
            </div>
        </div>
    );
}