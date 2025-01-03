import React, { useState } from 'react'
import PiauiMapa from './components/main/Mapa'
import "./App.css"
import Header from './components/main/Header'
import Lista from './components/main/Lista'
import Filtros from './components/main/Filtros'

function MainContent() {
  const [cidade, setCidade] = useState(null);
  const [csvData, setCsvData] = useState(null)
  const [mes, setMes] = useState(['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'])
  const [ano, setAno] = useState()

  // gerencia estado quando nova cidade é clicada
  const handleCidade = (cidade) => {
    setCidade(cidade);
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

      <Filtros dadosCsv={csvData} onCidadeSelecionada={handleCidade}
        selectedCity={cidade} meses={mes} onMesSelecionado={handleMes} selectedMonth={mes} />

      <div className="conteudo">
        <PiauiMapa
          onCidadeSelecionada={handleCidade}
          onCsvData={setCsvData}
        />

        <Lista />
      </div>
    </div>
  )
}

export default MainContent