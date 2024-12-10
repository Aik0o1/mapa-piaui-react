import { useState, Fragment } from 'react'
// import './App.css'
import { RadioSVGMap } from "react-svg-map";
import "react-svg-map/lib/index.css";
import Map from './assets/imgs/map.svg'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Fragment>
      <div id="map-container">
      <Map/>
      </div>
      </Fragment>
  )
}

export default App
