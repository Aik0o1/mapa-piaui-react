import React, { useState, Fragment } from 'react'
import PiauiMapa from './components/main/Mapa'
import Tabela from './components/main/Tabela'
import "./App.css"


function MainContent(props) {
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
  return (
    <Fragment>
    <div className="main  flex justify-aroud content-center ">
      <Tabela dadosCidade={cidadeSelecionada}></Tabela>
      <PiauiMapa onCidadeSelecionada={setCidadeSelecionada}></PiauiMapa>
    </div>
    </Fragment>
  )
}

export default MainContent  