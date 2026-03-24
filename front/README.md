# Frontend Painel Empresarial

Frontend desenvolvido em React (Vite) para visualização de métricas e mapas do estado do Piauí.

## 🚀 Como Rodar

### Modo Local (Desenvolvimento)
1. **Requisitos:** Node.js 18+
2. **Setup:**
   ```bash
   npm install
   ```
3. **Execução:**
   ```bash
   npm run dev
   ```
O frontend estará em `http://localhost:5173`.

### Modo Docker (Produção/Nginx)
O frontend é servido via Nginx e orquestrado pelo Docker Compose. 
- **Porta Externa:** `5173`
- **Porta Interna:** `80` (dentro do container Nginx)

## ⚙️ Configuração (.env)
O arquivo `front/.env` contém as variáveis:
- `VITE_URL_API`: URL base da API (padrão `/api` para usar o proxy do Nginx).
- `VITE_API_TOKEN`: Token Bearer para autorizar as chamadas da API.

## 🛠 Arquitetura do Frontend
- `nginx.conf`: Configura o proxy reverso para que `/api/` seja redirecionado ao container da API.
- `src/App.jsx`: Componente principal que gerencia o estado global de filtros.
- `src/components/main/`: Componentes visuais principais (Mapa, Filtros, Abas).
- `src/components/graphs/`: Gráficos dinâmicos (PieCharts, Sunburst, etc.).
