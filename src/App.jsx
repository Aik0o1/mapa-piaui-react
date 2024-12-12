import React, { useState, Fragment } from 'react'
import PiauiMapa from './components/main/Mapa'
import TabelaCidade from './components/main/Tabela'
import { ComboboxCidades } from './components/ui/combobox'
import "./App.css"

function MainContent() {
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
  const [csvData, setCsvData] = useState(null)

  // Função para atualizar a cidade em todos os componentes
  const handleCidadeSelecionada = (cidade) => {
    setCidadeSelecionada(cidade);
    // Atualiza o hash para o mapa
    window.location.hash = cidade.ID
  }

  return (
    <div className="main flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 p-4">
      <div className="flex flex-col space-y-4 w-full md:w-1/3">
        <ComboboxCidades 
          dadosCsv={csvData} 
          onCidadeSelecionada={handleCidadeSelecionada}
          selectedCity={cidadeSelecionada}
        />
        <TabelaCidade dadosCidade={cidadeSelecionada} />
      </div>
      <PiauiMapa 
        onCidadeSelecionada={handleCidadeSelecionada} 
        onCsvData={setCsvData} 
      />
    </div>
  )
}

export default MainContent