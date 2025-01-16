import couchdb
from urllib.parse import quote
import json
from flask import Flask, jsonify, Response, request
from flask_cors import CORS
import datetime

# Database connection setup
password = 'sti@JUCEPI_2020'
encoded_password = quote(password)
couch = couchdb.Server(f'http://admin:{encoded_password}@10.40.25.11:5984/')
db_name = 'test2'

# Check if database exists
if db_name in couch:
    db = couch[db_name]
else:
    print(f"O banco de dados '{db_name}' não existe.")
    exit()

app = Flask(__name__)
CORS(app)

@app.route('/buscar_todas', methods=['GET'])
def dados_gerais():
    mes_param = request.args.get('mes', type=int)  
    ano_param = request.args.get('ano', type=int)

    data_mais_atual = datetime.datetime(2024, 1, 1)
    documento_mais_recente = None

    for doc_id in db:
        documento = db[doc_id]
        mes_ano = documento["data"].split('/')
        mes = int(mes_ano[0])
        ano = int(mes_ano[1])
        new_date = datetime.datetime(ano, mes, 1)

        if mes_param and ano_param:
            if ano == ano_param and mes == mes_param:
                documento_mais_recente = documento
                break  
        else:
            if new_date > data_mais_atual:
                data_mais_atual = new_date
                documento_mais_recente = documento

    if not documento_mais_recente:
        return jsonify({"error": "Nenhum documento encontrado"}), 404

    totais = {
        "naturezas": [],
        "portes": [],
        "atividades": [],
        "abertura": [],
        "tempo-de-analise": [],
        "tempo-de-resposta": []
    }

    for _, valor in documento_mais_recente['cidades'].items():
        # Processa naturezas
        for natureza in valor.get('naturezas', []):
            totais["naturezas"].append({
                "tipo": natureza['tipo'],
                "qtd_por_natureza": natureza['qtd_por_natureza']
            })

        # Processa portes
        for porte in valor.get('portes', []):
            totais["portes"].append({
                "tipo": porte['tipo'],
                "qtd_por_porte": porte['qtd_por_porte']
            })

        # Processa atividades
        for atividade in valor.get('atividades', []):
            totais["atividades"].append({
                "tipo": atividade['tipo'],
                "qtd_por_seção_da_atividade": atividade['qtd_por_seção_da_atividade']
            })

        # Processa aberturas
        for abertura in valor.get('abertura', []):
            if isinstance(abertura, dict):
                totais["abertura"].append({
                    "tipo": abertura.get('tipo'),
                    "qtd_abertas_no_mes": abertura.get('qtd_abertas_no_mes', 0)
                })

        # Processa tempos de análise
        for tempo_a in valor.get('tempo-de-analise', []):
            if isinstance(tempo_a, dict):
                totais["tempo-de-analise"].append({
                    'tipo': tempo_a.get('tipo'),
                    "tempo_analise": tempo_a.get('tempo_analise', '00:00:00')
                })

        # Processa tempos de resposta
        for tempo_r in valor.get('tempo-de-resposta', []):
            if isinstance(tempo_r, dict):
                totais["tempo-de-resposta"].append({
                    'tipo': 'tempo_resposta',
                    "tempo_resposta": tempo_r.get('tempo_resposta', '00:00:00')
                })

    # Consolida os dados
    totais["naturezas"] = _consolidar_dados(totais["naturezas"], "qtd_por_natureza")
    totais["portes"] = _consolidar_dados(totais["portes"], "qtd_por_porte")
    totais["atividades"] = _consolidar_dados(totais["atividades"], "qtd_por_seção_da_atividade")
    totais["nome"] = "Todos"

    total_aberturas = sum(item['qtd_abertas_no_mes'] for item in totais["abertura"])
    totais["abertura"] = [{
        "tipo": "todas",
        "qtd_abertas_no_mes": total_aberturas
    }]

    totais["tempo-de-analise"] = somar_tempos(totais["tempo-de-analise"], 'tempo_analise')
    totais["tempo-de-resposta"] = somar_tempos(totais["tempo-de-resposta"], 'tempo_resposta')

    # Retorna os dados em formato JSON
    response = jsonify(totais)
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response


def _consolidar_dados(dados, campo_soma):
    """Consolida dados agrupando por tipo e somando os valores de um campo específico."""
    consolidado = {}
    for item in dados:
        tipo = item['tipo']
        qtd = item[campo_soma]
        if tipo in consolidado:
            consolidado[tipo] += qtd
        else:
            consolidado[tipo] = qtd
    return [{"tipo": tipo, campo_soma: qtd} for tipo, qtd in consolidado.items()]
    
from collections import defaultdict

def somar_tempos(tempos, campo):
    """Soma uma lista de tempos por tipo e retorna o total no formato desejado."""
    # Dicionário para armazenar a soma dos tempos por tipo
    tempos_por_tipo = defaultdict(int)

    # Itera sobre os tempos
    for tempo in tempos:
        try:
            # Converte o tempo para horas, minutos e segundos
            h, m, s = map(int, tempo[campo].split(':'))
            # Calcula os segundos totais
            total_segundos = h * 3600 + m * 60 + s
            # Soma o total de segundos no tipo correspondente
            tempos_por_tipo[tempo['tipo']] += total_segundos
        except ValueError:
            print(f"Formato inválido de tempo: {tempo}")
            continue

    # Converte o total de segundos por tipo para o formato 'hh:mm:ss' e retorna como lista
    resultados = []
    for tipo, total_segundos in tempos_por_tipo.items():
        horas = total_segundos // 3600
        minutos = (total_segundos % 3600) // 60
        segundos = total_segundos % 60
        resultados.append({
            'tipo': tipo,
            campo: f"{horas:02}:{minutos:02}:{segundos:02}"
        })

    return resultados

@app.route('/buscar_dados', methods=['GET'])
def buscar_dados():
    cidade = request.args.get('cidade')
    # print(cidade)
    mes = request.args.get('mes')
    ano = request.args.get('ano')

    if not cidade or not mes or not ano:
        return jsonify({"error": "Cidade, mês e ano são necessários"}), 400
    
    # Formata a data no formato "mês/ano"
    data_procurada = f"{mes}/{ano}"
    
    # Acessa o banco de dados
    for doc in db:
        documento = db[doc]

        if documento['data'] == data_procurada:
            print(data_procurada)
        # return jsonify({"error": "Dados não encontrados para o mês/ano especificado"}), 404
            cidade_encontrada = documento['cidades'].get(cidade)

            if not cidade_encontrada:
                return jsonify({"error": "Cidade não encontrada"}), 404

            cidade_encontrada['id'] = cidade
            cidade_encontrada['data'] = data_procurada
            
            # Retorna os dados com charset UTF-8 no cabeçalho Content-Type
            response = jsonify(cidade_encontrada)
            response.headers['Content-Type'] = 'application/json; charset=utf-8'
            return response
            
    return jsonify({"error": "Dados não encontrados para o mês/ano especificado"}), 404

# Return list of all cities
@app.route('/cidades')
def get_all_cidades():
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    
    # Extrai os nomes das cidades
    nomes_cidades = [cidade_data['nome'] for cidade_id, cidade_data in doc['cidades'].items()]
    
    return jsonify(nomes_cidades)

# Return all city names with their data
@app.route('/dados')
def get_all_data():
    doc = db['6d66c335d17c58f7257574d13f000589']
    return jsonify(doc['cidades'])

# Get data for a specific city
@app.route('/cidade/<codigo>')
def get_cidade_data(codigo):
    doc = db['6d66c335d17c58f7257574d13f000589']
    if codigo in doc['cidades']:
        return jsonify(doc['cidades'][codigo])
    return jsonify({"error": "Cidade não encontrada"}), 404

# Get all naturezas for a specific city
@app.route('/cidade/<codigo>/naturezas')
def get_naturezas(codigo):
    doc = db['6d66c335d17c58f7257574d13f000589']
    if codigo in doc['cidades']:
        return jsonify(doc['cidades'][codigo]['naturezas'])
    return jsonify({"error": "Cidade não encontrada"}), 404

# Get all portes for a specific city
@app.route('/cidade/<codigo>/portes')
def get_portes(codigo):
    doc = db['6d66c335d17c58f7257574d13f000589']
    if codigo in doc['cidades']:
        return jsonify(doc['cidades'][codigo]['portes'])
    return jsonify({"error": "Cidade não encontrada"}), 404

# lista de todos os nomes de cidades
@app.route('/id_nome_cidades', methods=['GET'])
def get_id_nome_cidades():
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    
    # Formata os dados no formato desejado
    cidades = [{"id": int(cidade_id), "nome": cidade_data['nome']} 
               for cidade_id, cidade_data in doc['cidades'].items()]
    
    # Gera o JSON com UTF-8 explicitamente configurado
    response = Response(json.dumps(cidades, ensure_ascii=False), content_type='application/json; charset=utf-8')
    return response

# Get all atividades for a specific city
@app.route('/cidade/<codigo>/atividades')
def get_atividades(codigo):
    doc = db['6d66c335d17c58f7257574d13f000589']
    if codigo in doc['cidades']:
        return jsonify(doc['cidades'][codigo]['atividades'])
    return jsonify({"error": "Cidade não encontrada"}), 404

# Get data and month
@app.route('/info')
def get_data():
    doc = db['6d66c335d17c58f7257574d13f000589']
    return jsonify({"data": doc['data']})

# @app.route('/data_recente')
# def retorna_data_mais_recente():
#     data_mais_atual = datetime.date(2024, 1,1)

#     for doc in db:
#         # print(doc)
#         documento = db[doc]["data"]
#         mes_ano = documento.split('/')
#         mes = int(mes_ano[0])
#         ano = int(mes_ano[1])
#         # print("\n", documento)
#         new = datetime.date(ano, mes, 1)
#         # print(new)
#         if new > data_mais_atual:
#             data_mais_atual = new

#     ano, mes, dia = str(data_mais_atual).split('-')
    
#     return (f'{mes}/{ano}')

@app.route('/data_recente')
def retorna_data_mais_recente():
    import datetime

    data_mais_atual = datetime.date(2024, 1, 1)

    for doc in db:
        documento = db[doc]["data"]
        mes_ano = documento.split('/')
        mes = int(mes_ano[0])
        ano = int(mes_ano[1])
        new = datetime.date(ano, mes, 1)
        if new > data_mais_atual:
            data_mais_atual = new

    ano, mes, _ = str(data_mais_atual).split('-')

    # Retorna o JSON no formato { "mes": "MM", "ano": "AAAA" }
    return jsonify({"mes": mes, "ano": ano})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
