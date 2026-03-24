# Mapa Piauí - Painel Empresarial

Sistema full-stack para visualização de métricas empresariais (aberturas, empresas ativas e rankings) do estado do Piauí.

## 🏗 Arquitetura

O projeto é dividido em três componentes principais:

1.  **Frontend:** React (Vite) + TailwindCSS, rodando em Nginx.
2.  **API:** FastAPI (Python) com integração assíncrona.
3.  **Banco de Dados:** CouchDB para armazenamento de documentos NoSQL.

## 🚀 Como Rodar (Docker)

A maneira mais simples de executar o projeto é utilizando o Docker Compose:

```bash
docker-compose up -d --build
```

### URLs de Acesso

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **API (Swagger):** [http://localhost:5050/docs](http://localhost:5050/docs)

## ⚙️ Configuração

As configurações são gerenciadas via arquivos `.env` em cada subdiretório:

-   **API (`api/.env`):** Configurações de conexão com o CouchDB e tokens de segurança.
-   **Frontend (`front/.env`):** URL da API e tokens necessários para as requisições.

---

### Links Úteis
- [Documentação da API](./api/README.md)
- [Documentação do Frontend](./front/README.md)
