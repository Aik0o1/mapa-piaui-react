import React, { useState, Fragment } from 'react'
import PiauiMapa from './components/main/Mapa'
import Tabela from './components/main/Tabela'
import { ComboboxDemo } from './components/ui/combobox'
import "./App.css"


function MainContent() {
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
  const [csvData, setCsvData] = useState(null)
  return (
    <Fragment>
    <div className="main  flex justify-aroud content-center ">
      <ComboboxDemo dadosCsv={csvData}></ComboboxDemo>
      <Tabela dadosCidade={cidadeSelecionada}></Tabela>
      <PiauiMapa onCidadeSelecionada={setCidadeSelecionada} onCsvData={setCsvData}></PiauiMapa>
    </div>
    </Fragment>
  )
}

export default MainContent  