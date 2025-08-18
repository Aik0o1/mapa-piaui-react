import React, { useState, useEffect } from "react";

export default function Header() {

  const apiUrl = import.meta.env.VITE_URL_API;
  const apiToken = import.meta.env.VITE_API_TOKEN;

  const [data_atualizacao, setDataAtualizacao] = useState()
  useEffect(() => {
    const fetchUltimaAtualizacao = async () => {
      try {
        const url = `${apiUrl}/ultima_atualizacao`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          setDataAtualizacao(null);
        } else {
          setDataAtualizacao(data.ultimaAtualizacao);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do servidor:", error);
      }
    };

    fetchUltimaAtualizacao();
  }, []);

  return (
    <header className="header bg-white shadow-md py-4 px-6 flex items-center justify-between md:flex-row flex-col">
      <div className="flex items-center justify-center gap-4">
        <img
          src="https://portal.pi.gov.br/jucepi/wp-content/uploads/sites/47/2023/03/jucepi_logo-768x177.jpg"
          alt="JUCEPI Logo"
          className="h-16 object-contain"
        />
        <h1 className="text-[#034ea2] text-2xl font-semibold">
          Dados Empresariais
        </h1>
      </div>
      <span className="text-[#034ea2] font-bold">Última Atualização: {data_atualizacao}</span>
    </header>
  );
};
