import os
import json
import couchdb
import datetime
from flask_cors import CORS
from dotenv import load_dotenv
from urllib.parse import quote
from flask import Flask, jsonify, Response, request
from functools import wraps

load_dotenv()  # take environment variables

# Database connection setup
password = os.getenv("SENHA")
encoded_password = quote(password)
couch = couchdb.Server(f'http://admin:{encoded_password}@{os.getenv("IP")}')

abertas_db_name = "municipios-2024"
ativas_db_name = "dados_ativas"

# Check if database exists
if abertas_db_name in couch and ativas_db_name in couch:
    db = couch[abertas_db_name]
    db_ativas = couch[ativas_db_name]
    print(db_ativas)

else:
    print(f"O banco de dados '{abertas_db_name}' não existe.")
    exit()

app = Flask(__name__)
CORS(app)

API_TOKEN = os.getenv("API_TOKEN", "123456789")

# Decorator para verificar token único
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Token pode ser passado de 3 formas:
        # 1. Header Authorization: "Bearer <token>"
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Remove "Bearer " do início
            except IndexError:
                token = auth_header  # Caso seja enviado só o token sem "Bearer"
        
        # 2. Header X-API-Token
        elif 'X-API-Token' in request.headers:
            token = request.headers['X-API-Token']
        
        # 3. Query parameter ?token=
        elif 'token' in request.args:
            token = request.args.get('token')
        
        if not token:
            return jsonify({'message': 'Token é obrigatório!'}), 401
        
        # Verifica se o token é válido
        if token != API_TOKEN:
            return jsonify({'message': 'Token inválido!'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

# Rota para verificar se o token é válido
@app.route('/verify-token', methods=['GET'])
@token_required
def verify_token():
    return jsonify({'message': 'Token válido!'}), 200


@app.route("/empresas_abertas", methods=["GET"])
@token_required
def buscar_municipios():
    try:
        # Obtém parâmetros da URL
        cidade = request.args.get("cidade")  # Ex: "2211001"
        mes = request.args.get("mes")  # Ex: "12"
        ano = request.args.get("ano")  # Ex: "2024"

        # Validação básica
        if not all([cidade, mes, ano]):
            return (
                jsonify(
                    {"error": "Parâmetros 'cidade', 'mes' e 'ano' são obrigatórios"}
                ),
                400,
            )

        # Acessa o banco de dados
        db_name = "dados_empresariais"
        if db_name not in couch:
            return jsonify({"error": f"Banco de dados '{db_name}' não existe"}), 404

        db = couch[db_name]
        doc_id = f"{mes.zfill(2)}-{ano}"  # Formato "12-2024"

        # Verifica se o documento existe
        if doc_id not in db:
            return jsonify({"error": f"Documento {doc_id} não encontrado"}), 404

        doc = db[doc_id]

        # Verifica se a cidade existe no documento
        if cidade not in doc:
            return (
                jsonify({"error": f"Cidade {cidade} não encontrada no documento"}),
                404,
            )

        # Resposta de sucesso
        return jsonify({"id": doc_id, "municipio": cidade, **doc[cidade]})

    except couchdb.http.Unauthorized:
        return jsonify({"error": "Acesso não autorizado ao CouchDB"}), 401
    except Exception as e:
        # Log do erro real (aparece no terminal onde o Flask está rodando)
        app.logger.error(f"Erro interno: {str(e)}", exc_info=True)
        return jsonify({"error": "Erro interno no servidor"}), 500


@app.route("/empresas_ativas", methods=["GET"])
@token_required
def buscar_empresas_abertas():
    try:
        # Obtém parâmetros da URL
        cidade = request.args.get("cidade")  # Ex: "2211001" ou "total"
        mes = request.args.get("mes")  # Ex: "12"
        ano = request.args.get("ano")  # Ex: "2024"
        
        # Validação básica
        if not all([cidade, mes, ano]):
            return (
                jsonify(
                    {"error": "Parâmetros 'cidade', 'mes' e 'ano' são obrigatórios"}
                ),
                400,
            )
        
        # Acessa o banco de dados
        db_name = "dados_ativas"
        if db_name not in couch:
            return jsonify({"error": f"Banco de dados '{db_name}' não existe"}), 404
        
        db = couch[db_name]
        doc_id = f"{mes.zfill(2)}-{ano}"  # Formato "12-2024"
        
        # Verifica se o documento existe
        if doc_id not in db:
            return jsonify({"error": f"Documento {doc_id} não encontrado"}), 404
        
        doc = db[doc_id]
        
        # Verifica se a cidade existe no documento
        if cidade not in doc:
            return (
                jsonify({"error": f"Cidade {cidade} não encontrada no documento"}),
                404,
            )
        
        # Resposta de sucesso - trata tanto códigos IBGE quanto "total"
        if cidade == "total":
            return jsonify({
                "id": doc_id, 
                "municipio": "total",
                "tipo": "total",
                **doc[cidade]
            })
        else:
            return jsonify({
                "id": doc_id, 
                "municipio": cidade,
                "tipo": "municipio", 
                **doc[cidade]
            })
            
    except couchdb.http.Unauthorized:
        return jsonify({"error": "Acesso não autorizado ao CouchDB"}), 401
    except Exception as e:
        # Log do erro real (aparece no terminal onde o Flask está rodando)
        app.logger.error(f"Erro interno: {str(e)}", exc_info=True)
        return jsonify({"error": "Erro interno no servidor"}), 500
    
    
@app.route("/buscar_todas", methods=["GET"])
@token_required
def dados_gerais():
    mes_param = request.args.get("mes", type=int)
    ano_param = request.args.get("ano", type=int)

    data_mais_atual = datetime.datetime(2024, 1, 1)
    documento_mais_recente = None

    for doc_id in db:
        documento = db[doc_id]
        mes_ano = documento["data"].split("/")
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
        "tempo-de-resposta": [],
    }

    for _, valor in documento_mais_recente["cidades"].items():
        # Processa naturezas
        if isinstance(valor.get("naturezas"), list):
            for natureza in valor.get("naturezas", []):
                totais["naturezas"].append(
                    {
                        "tipo": natureza["tipo"],
                        "qtd_por_natureza": natureza["qtd_por_natureza"],
                    }
                )
        else:
            totais["naturezas"].append({"tipo": "Sem dados", "qtd_por_natureza": 0})

        # Processa portes
        if isinstance(valor.get("portes"), list):
            for porte in valor.get("portes", []):
                totais["portes"].append(
                    {"tipo": porte["tipo"], "qtd_por_porte": porte["qtd_por_porte"]}
                )
        else:
            totais["portes"].append({"tipo": "Sem dados", "qtd_por_porte": 0})

        # Processa atividades
        if isinstance(valor.get("atividades"), list):
            for atividade in valor.get("atividades", []):
                totais["atividades"].append(
                    {
                        "tipo": atividade["tipo"],
                        "qtd_por_seção_da_atividade": atividade[
                            "qtd_por_seção_da_atividade"
                        ],
                    }
                )
        else:
            totais["atividades"].append(
                {"tipo": "Sem dados", "qtd_por_seção_da_atividade": 0}
            )

        # Processa aberturas
        for abertura in valor.get("abertura", []):
            if isinstance(abertura, dict):
                totais["abertura"].append(
                    {
                        "tipo": abertura.get("tipo"),
                        "qtd_abertas_no_mes": abertura.get("qtd_abertas_no_mes", 0),
                    }
                )

        # Processa tempos de análise
        for tempo_a in valor.get("tempo-de-analise", []):
            if isinstance(tempo_a, dict):
                totais["tempo-de-analise"].append(
                    {
                        "tipo": tempo_a.get("tipo"),
                        "tempo_analise": tempo_a.get("tempo_analise", "00:00:00"),
                    }
                )

        # Processa tempos de resposta
        for tempo_r in valor.get("tempo-de-resposta", []):
            if isinstance(tempo_r, dict):
                totais["tempo-de-resposta"].append(
                    {
                        "tipo": "tempo_resposta",
                        "tempo_resposta": tempo_r.get("tempo_resposta", "00:00:00"),
                    }
                )

    # Consolida os dados
    totais["naturezas"] = _consolidar_dados(totais["naturezas"], "qtd_por_natureza")
    totais["portes"] = _consolidar_dados(totais["portes"], "qtd_por_porte")
    totais["atividades"] = _consolidar_dados(
        totais["atividades"], "qtd_por_seção_da_atividade"
    )
    # totais["nome"] = "Teresina"

    total_aberturas = sum(item["qtd_abertas_no_mes"] for item in totais["abertura"])
    totais["abertura"] = [{"tipo": "todas", "qtd_abertas_no_mes": total_aberturas}]

    totais["tempo-de-analise"] = somar_tempos(
        totais["tempo-de-analise"], "tempo_analise"
    )
    totais["tempo-de-resposta"] = somar_tempos(
        totais["tempo-de-resposta"], "tempo_resposta"
    )

    # Retorna os dados em formato JSON
    response = jsonify(totais)
    response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response

# @app.route('/buscar_todas_ativas', methods=['GET'])
# def dados_gerais_ativas():
#     mes_param = request.args.get('mes', type=int)
#     ano_param = request.args.get('ano', type=int)
    
#     # Formato do documento: "12-2024"
#     doc_id = f"{str(mes_param).zfill(2)}-{ano_param}"
    
#     # Verifica se o documento existe
#     if doc_id not in db_ativas:
#         return jsonify({"error": "Nenhum documento encontrado"}), 404
    
#     documento = db_ativas[doc_id]
    
#     totais = {
#         "naturezas": {},
#         "portes": {},
#         "secoes_atividades": {},
#         "total_ativas": 0
#     }
    
#     # Itera sobre todos os municípios no documento
#     for codigo_municipio, dados_municipio in documento.items():
#         if 'ativas' not in dados_municipio:
#             continue
            
#         ativas_municipio = dados_municipio['ativas']
        
#         # Processa naturezas
#         if 'naturezas' in ativas_municipio and ativas_municipio['naturezas']:
#             for tipo_natureza, quantidade in ativas_municipio['naturezas'].items():
#                 if quantidade is not None and quantidade > 0:
#                     if tipo_natureza in totais["naturezas"]:
#                         totais["naturezas"][tipo_natureza] += quantidade
#                     else:
#                         totais["naturezas"][tipo_natureza] = quantidade
        
#         # Processa portes
#         if 'portes' in ativas_municipio and ativas_municipio['portes']:
#             for tipo_porte, quantidade in ativas_municipio['portes'].items():
#                 if quantidade is not None and quantidade > 0:
#                     if tipo_porte in totais["portes"]:
#                         totais["portes"][tipo_porte] += quantidade
#                     else:
#                         totais["portes"][tipo_porte] = quantidade
        
#         # Processa seções de atividades
#         if 'secoes_atividades' in ativas_municipio and ativas_municipio['secoes_atividades']:
#             for tipo_atividade, quantidade in ativas_municipio['secoes_atividades'].items():
#                 if quantidade is not None and quantidade > 0:
#                     if tipo_atividade in totais["secoes_atividades"]:
#                         totais["secoes_atividades"][tipo_atividade] += quantidade
#                     else:
#                         totais["secoes_atividades"][tipo_atividade] = quantidade
    
#     # Calcula o total de empresas ativas
#     totais["total_ativas"] = sum(totais["portes"].values())
    
#     print(totais)
    
#     # Retorna os dados em formato JSON
#     response = jsonify(totais)
#     response.headers['Content-Type'] = 'application/json; charset=utf-8'
#     return response


def _consolidar_dados(dados, campo_soma):
    """Consolida dados agrupando por tipo e somando os valores de um campo específico."""
    consolidado = {}
    for item in dados:
        tipo = item["tipo"]
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
            h, m, s = map(int, tempo[campo].split(":"))
            # Calcula os segundos totais
            total_segundos = h * 3600 + m * 60 + s
            # Soma o total de segundos no tipo correspondente
            tempos_por_tipo[tempo["tipo"]] += total_segundos
        except ValueError:
            print(f"Formato inválido de tempo: {tempo}")
            continue

    # Converte o total de segundos por tipo para o formato 'hh:mm:ss' e retorna como lista
    resultados = []
    for tipo, total_segundos in tempos_por_tipo.items():
        horas = total_segundos // 3600
        minutos = (total_segundos % 3600) // 60
        segundos = total_segundos % 60
        resultados.append(
            {"tipo": tipo, campo: f"{horas:02}:{minutos:02}:{segundos:02}"}
        )

    return resultados


@app.route("/abertas", methods=["GET"])
@token_required
def buscar_dados_abertas():
    cidade = request.args.get("cidade")
    # print(cidade)
    mes = request.args.get("mes")
    ano = request.args.get("ano")

    if not cidade or not mes or not ano:
        return jsonify({"error": "Cidade, mês e ano são necessários"}), 400

    # Formata a data no formato "mês/ano"
    data_procurada = f"{mes}/{ano}"

    # Acessa o banco de dados
    for doc in db:
        documento = db[doc]

        if documento["data"] == data_procurada:
            print(data_procurada)
            # return jsonify({"error": "Dados não encontrados para o mês/ano especificado"}), 404
            cidade_encontrada = documento["cidades"].get(cidade)

            if not cidade_encontrada:
                return jsonify({"error": "Cidade não encontrada"}), 404

            cidade_encontrada["id"] = cidade
            cidade_encontrada["data"] = data_procurada

            # Retorna os dados com charset UTF-8 no cabeçalho Content-Type
            response = jsonify(cidade_encontrada)
            response.headers["Content-Type"] = "application/json; charset=utf-8"
            return response

    return jsonify({"error": "Dados não encontrados para o mês/ano especificado"}), 404


@app.route("/ativas", methods=["GET"])
@token_required
def buscar_dados_ativas():
    cidade = request.args.get("cidade")
    # print(cidade)
    mes = request.args.get("mes")
    ano = request.args.get("ano")

    if not cidade or not mes or not ano:
        return jsonify({"error": "Cidade, mês e ano são necessários"}), 400

    # Formata a data no formato "mês/ano"
    data_procurada = f"{mes}/{ano}"

    # Acessa o banco de dados
    for doc in db_ativas:
        documento = db_ativas[doc]

        if documento["data"] == data_procurada:
            print(data_procurada)
            # return jsonify({"error": "Dados não encontrados para o mês/ano especificado"}), 404
            cidade_encontrada = documento["cidades"].get(cidade)

            if not cidade_encontrada:
                return jsonify({"error": "Cidade não encontrada"}), 404

            cidade_encontrada["id"] = cidade
            cidade_encontrada["data"] = data_procurada

            # Retorna os dados com charset UTF-8 no cabeçalho Content-Type
            response = jsonify(cidade_encontrada)
            response.headers["Content-Type"] = "application/json; charset=utf-8"
            return response

    return jsonify({"error": "Dados não encontrados para o mês/ano especificado"}), 404


# Return list of all cities
@app.route("/cidades")
@token_required
def get_all_cidades():
    doc = db[os.getenv("DOCUMENTO")]

    # Extrai os nomes das cidades
    nomes_cidades = [
        cidade_data["nome"] for cidade_id, cidade_data in doc["cidades"].items()
    ]

    return jsonify(nomes_cidades)


# Return all city names with their data
@app.route("/dados")
@token_required
def get_all_data():
    doc = db[os.getenv("DOCUMENTO")]

    return jsonify(doc["cidades"])


# Get data for a specific city
@app.route("/cidade/<codigo>")
@token_required
def get_cidade_data(codigo):
    doc = db[os.getenv("DOCUMENTO")]

    if codigo in doc["cidades"]:
        return jsonify(doc["cidades"][codigo])
    return jsonify({"error": "Cidade não encontrada"}), 404


# Get all naturezas for a specific city
@app.route("/cidade/<codigo>/naturezas")
@token_required
def get_naturezas(codigo):
    doc = db[os.getenv("DOCUMENTO")]

    if codigo in doc["cidades"]:
        return jsonify(doc["cidades"][codigo]["naturezas"])
    return jsonify({"error": "Cidade não encontrada"}), 404


# Get all portes for a specific city
@app.route("/cidade/<codigo>/portes")
@token_required
def get_portes(codigo):
    doc = db[os.getenv("DOCUMENTO")]

    if codigo in doc["cidades"]:
        return jsonify(doc["cidades"][codigo]["portes"])
    return jsonify({"error": "Cidade não encontrada"}), 404


# lista de todos os nomes de cidades
@app.route("/id_nome_cidades", methods=["GET"])
@token_required
def get_id_nome_cidades():
    doc = db[os.getenv("DOCUMENTO")]

    # Formata os dados no formato desejado
    cidades = [
        {"id": int(cidade_id), "nome": cidade_data["nome"]}
        for cidade_id, cidade_data in doc["cidades"].items()
    ]

    # Gera o JSON com UTF-8 explicitamente configurado
    response = Response(
        json.dumps(cidades, ensure_ascii=False),
        content_type="application/json; charset=utf-8",
    )
    return response


# Get all atividades for a specific city
@app.route("/cidade/<codigo>/atividades")
@token_required
def get_atividades(codigo):
    doc = db[os.getenv("DOCUMENTO")]

    if codigo in doc["cidades"]:
        return jsonify(doc["cidades"][codigo]["atividades"])
    return jsonify({"error": "Cidade não encontrada"}), 404


# Get data and month
@app.route("/info")
@token_required
def get_data():
    doc = db[os.getenv("DOCUMENTO")]

    return jsonify({"data": doc["data"]})


@app.route('/data_recente')
@token_required
def retorna_data_mais_recente():
    try:
        db_name = "dados_empresariais"

        if db_name not in couch:
            return jsonify({"error": f"Banco de dados '{db_name}' não existe"}), 404

        db = couch[db_name]

        # Obtém todos os documentos (apenas os IDs)
        all_docs = db.view('_all_docs', include_docs=False)

        if not all_docs.rows:
            return jsonify({"error": "Nenhum documento encontrado"}), 404

        # Transforma IDs em datas e ordena corretamente
        def id_para_data(doc_id):
            try:
                mes, ano = map(int, doc_id.split('-'))
                return datetime.date(ano, mes, 1)
            except ValueError:
                return None

        datas_validas = [
            (doc_id, id_para_data(doc_id))
            for doc_id in [row.id for row in all_docs.rows]
        ]

        # Filtra somente datas válidas
        datas_validas = [(doc_id, data) for doc_id, data in datas_validas if data]

        # Ordena por data
        datas_ordenadas = sorted(datas_validas, key=lambda x: x[1])

        if not datas_ordenadas:
            return jsonify({"error": "Nenhuma data válida encontrada nos IDs"}), 404

        # Último ID pela data mais recente
        ultimo_id = datas_ordenadas[-1][0]
        mes, ano = ultimo_id.split('-')

        return jsonify({"mes": mes.zfill(2), "ano": ano})

    except Exception as e:
        app.logger.error(f"Erro interno: {str(e)}", exc_info=True)
        return jsonify({"error": "Erro interno no servidor"}), 500
if __name__ == "__main__":
    app.run()
