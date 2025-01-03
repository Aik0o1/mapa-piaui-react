import React, { useState } from 'react'
import PiauiMapa from './components/main/Mapa'
import "./App.css"
import Header from './components/main/Header'
import Lista from './components/main/Lista'
import Filtros from './components/main/Filtros'

function MainContent() {
  const [cidade, setCidade] = useState(null);
  const [mes, setMes] = useState([
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]);
  const [ano, setAno] = useState();

  // Atualiza estado quando nova cidade é clicada/selecionada
  const handleCidade = (cidade) => {
    setCidade(cidade);
    console.log("Cidade selecionada no App:", cidade);
  };

  // Atualiza estado quando um mês é selecionado
  const handleMes = (mes) => {
    setMes(mes);
    console.log(mes);
  };

  // Atualiza estado quando o ano é selecionado
  const handleAnoSelecionado = (ano) => {
    setAno(ano);
  };

  return (
    <div className="">

      <Header />

      <Filtros
        onCidadeSelecionada={handleCidade}
        selectedCity={cidade}
        meses={mes}
        onMesSelecionado={handleMes}
        selectedMonth={mes}
      />

      <div className="conteudo">
        <PiauiMapa
          onCidadeSelecionada={handleCidade}
        />

        <Lista onCidadeSelecionada={cidade} />
      </div>
    </div>
  );
}

export default MainContent;
