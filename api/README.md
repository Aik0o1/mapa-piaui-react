# API Painel Empresarial v3

API desenvolvida em FastAPI para consulta de estatísticas (aberturas, ativas) e rankings empresariais, integrada com CouchDB.

## 🚀 Como Rodar

Esta API utiliza o [uv](https://github.com/astral-sh/uv) para gerenciamento de dependências e execução, garantindo velocidade e reprodutibilidade.

### Requisitos
- Python 3.10+
- [uv](https://github.com/astral-sh/uv) instalado
- CouchDB rodando (local ou remoto)

### Instalação e Execução

1. **Clone o repositório** (se aplicável):
   ```bash
   git clone <repo-url>
   cd api-tratamento-mapa-empresarial
   ```

2. **Crie o ambiente virtual e instale as dependências**:
   ```bash
   uv venv
   source .venv/bin/activate  # No Windows: .venv\Scripts\activate
   uv pip install -r requirements.txt
   ```

3. **Inicie a API**:
   ```bash
   uv run python main.py
   ```
   *Ou use o uvicorn diretamente:*
   ```bash
   uv run uvicorn main:app --reload
   ```

A API estará disponível em `http://localhost:8000`.

## 📚 Documentação (Swagger)

Acesse a documentação interativa em:
👉 [http://localhost:8000/docs](http://localhost:8000/docs)

Lá você encontrará:
- Explicação detalhada de cada endpoint.
- Exemplos de entrada e saída.
- Possibilidade de testar as requisições diretamente pelo navegador.

## 🛠 Estrutura do Projeto

- `main.py`: Ponto de entrada e definição dos endpoints.
- `database.py`: Lógica de conexão com CouchDB e criação de índices.
- `schemas.py`: Modelos de dados Pydantic V2 para validação e documentação.

## 🗄 Configuração do Banco de Dados

A API espera um CouchDB rodando. Você pode configurar a URL e as credenciais via variáveis de ambiente no `database.py`:
- `COUCHDB_URL`: URL base (ex: `http://admin:password@localhost:5984`)
- `DB_NAME`: Nome do banco de dados (padrão: `teste_ativas`)
