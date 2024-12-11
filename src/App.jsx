import React, { useState, Fragment } from 'react'
import PiauiMapa from './components/main/Mapa'
import "./App.css"

function BrazilMap() {
  return (
    <Fragment>
    <div className="main">
      <PiauiMapa></PiauiMapa>
    </div>
    </Fragment>
  )
}

export default BrazilMap  