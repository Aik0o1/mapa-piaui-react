import React, { useState } from 'react'
import PiauiMapa from './components/main/Mapa'
import "./Mapa.css"
import "./App.css"
import Header from './components/main/Header'
import Lista from './components/main/Lista'
import Filtros from './components/main/Filtros'

function MainContent() {
  const [cidade, setCidade] = useState({nome:"Teresina", id:"cidade-221100"});
  const [mes, setMes] = useState(['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'])
  const [ano, setAno] = useState()

  // gerencia estado quando nova cidade é clicada
  const handleCidade = (cidade) => {
    setCidade(cidade);
    console.log(`dsds ${cidade.id}`)
  }

  // gerencia estado quando mês é selecionado
  const handleMes = (mes) => {
    setMes(mes)
    console.log(mes);
  }

  // gerencia estado quando ano é selecionado
  const handleAnoSelecionado = (ano) => {
    setAno(ano)
  }

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
        />

        <Lista 
          cidadeSelecionadaNoMapa={cidade}
        />
      </div>
    </div>
  )
}

export default MainContent