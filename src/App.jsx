import React, { useState } from 'react'
import PiauiMapa from './components/main/Mapa'
import "./Mapa.css"
import "./App.css"
import Header from './components/main/Header'
import Lista from './components/main/Lista'
import Filtros from './components/main/Filtros'
import Footer from './components/main/Footer'

function MainContent() {
  const [cidade, setCidade] = useState({nome:"TERESINA", id:"221100"});
  const [mes, setMes] = useState('Novembro'); 
  const [ano, setAno] = useState(2024); 

  const handleCidade = (cidade) => {
    setCidade(cidade);
  };

  const handleMes = (mes) => {
    setMes(mes);
  };

  const handleAnoSelecionado = (ano) => {
    setAno(ano);
  };

  return (
    <div className="bg-gray-50">
      <Header />
      <Filtros
        onCidadeSelecionada={handleCidade}
        onMesSelecionado={handleMes}
        onAnoSelecionado={handleAnoSelecionado}
        selectedMonth={mes}
        selectedYear={ano}
        cidadeSelecionada={cidade}

      />
      <div className="conteudo">
        <PiauiMapa onCidadeSelecionada={handleCidade} />
        <Lista onCidadeSelecionada={cidade} mes={mes} ano={ano} />
      </div>
      <Footer/>
    </div>
  );
}

export default MainContent;