# Usando uma imagem leve e estável do Python
FROM python:3.9-slim

# Evita que o Python gere arquivos .pyc e permite logs em tempo real
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Definindo o diretório de trabalho
WORKDIR /app

# Instalando dependências do sistema necessárias (se houver alguma futura)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiando apenas o arquivo de dependências primeiro (otimiza cache do Docker)
COPY requirements.txt .

# Instalando as dependências do Python
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiando o restante do código da API
COPY . .

# Porta que a API escuta (conforme seu main:app no final do código)
EXPOSE 8003

# Comando para produção usando Gunicorn com worker Uvicorn
# --workers 4: Ideal para o processamento assíncrono do FastAPI
# --worker-class: Ponte necessária para o Gunicorn entender código assíncrono
CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8003"]