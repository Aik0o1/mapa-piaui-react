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
  const [dados, setDados] = useState();

  const buscarDados = async (cidade, mes, ano) => {
    if (!cidade) return;

    // const meses = [
    //   'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    //   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    // ]
    // const mesNumero = meses.indexOf(mes) + 1;

    try {
      const url = mes && ano
        ? `http://127.0.0.1:5000/buscar_dados?cidade=${cidade.id}&mes=11&ano=${ano}`
        : `http://127.0.0.1:5000/buscar_dados?cidade=${cidade.id}`;

      const response = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
      const data = await response.json();
      setDados(data); // Atualiza os dados com a resposta da API
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setDados(null);
    }
  };

  const handleCidade = (cidade) => {
    setCidade(cidade);
    // console.log(cidade);

    if (mes && ano) {
      buscarDados(cidade, mes, ano); // Atualiza a lista quando a cidade é selecionada
    }
  };

  const handleMes = (mes) => {
    setMes(mes);
    if (cidade && ano) {
      buscarDados(cidade, mes, ano); // Atualiza a lista quando o mês é alterado
    }
  };

  const handleAnoSelecionado = (ano) => {
    setAno(ano);
    if (cidade && mes) {
      buscarDados(cidade, mes, ano); // Atualiza a lista quando o ano é alterado
    }
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

        <Lista dadosRecebidos={dados} selectedCity={cidade} />
      </div>
    </div>
  );
}

export default MainContent;
