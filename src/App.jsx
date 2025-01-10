import React, { useState, useEffect } from 'react';
import PiauiMapa from './components/main/Mapa';
import './Mapa.css';
import './App.css';
import Header from './components/main/Header';
import Lista from './components/main/Lista';
import Filtros from './components/main/Filtros';
import Footer from './components/main/Footer';

function MainContent() {
  const [cidade, setCidade] = useState({ nome: 'Selecione um município', id: '' });
  const [mes, setMes] = useState(""); // Inicializa com valor vazio
  const [ano, setAno] = useState(""); // Inicializa com valor vazio
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/data_recente");
        const data = await response.json(); // Recebe o JSON no formato { "mes": "MM", "ano": "AAAA" }

        const meses = [
          "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
          "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const mesRecente = meses[parseInt(data.mes, 10) - 1]; // Converte número do mês para nome
        const anoRecente = data.ano;

        setMes(mesRecente);
        setAno(anoRecente);
        setLoading(false); 
      } catch (error) {
        console.error("Erro ao buscar dados do servidor:", error);
        setLoading(false); 
      }
    };

    fetchData(); 
  }, []); 

  if (loading) {
    return <div>Carregando...</div>; // Exibe uma mensagem de carregamento enquanto os dados não chegam
  }

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
      <Footer />
    </div>
  );
}

export default MainContent;
