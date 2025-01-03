import React, { useState } from 'react'
import PiauiMapa from './components/main/Mapa'
import "./App.css"
import Header from './components/main/Header'
import Lista from './components/main/Lista'
import Filtros from './components/main/Filtros'

function MainContent() {
  const [cidade, setCidade] = useState(null);
  const [mes, setMes] = useState(null);
  const [ano, setAno] = useState();

  // Atualiza estado quando nova cidade é clicada/selecionada
  const handleCidade = (cidade) => {
    setCidade(cidade);
    // console.log("Cidade selecionada no App:", cidade);
  };

  // Atualiza estado quando um mês é selecionado
  const handleMes = (mes) => {
    setMes(mes);
    console.log("Mês selecionado no App:", mes);
  };

  // Atualiza estado quando o ano é selecionado
  const handleAnoSelecionado = (ano) => {
    setAno(ano);
    console.log("Ano selecionado no App:", ano);

  };

  return (
    <div className="">

      <Header />

      <Filtros
        onCidadeSelecionada={handleCidade}
        selectedCity={cidade}
        onMesSelecionado={handleMes}
        onAnoSelecionado={handleAnoSelecionado}
      />

      <div className="conteudo">
        <PiauiMapa
          onCidadeSelecionada={handleCidade}
          selectedCity={cidade}
        />

        <Lista onCidadeSelecionada={cidade} />
      </div>
    </div>
  );
}

export default MainContent;
