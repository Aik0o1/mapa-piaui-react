from functools import wraps
import os
import json
import couchdb
import datetime
from flask_cors import CORS
from dotenv import load_dotenv
from urllib.parse import quote
from flask import Flask, jsonify, Response, request

load_dotenv()  # take environment variables

# Database connection setup
password = os.getenv("SENHA")
encoded_password = quote(password)
couch = couchdb.Server(f'http://admin:{encoded_password}@{os.getenv("IP")}')

abertas_db_name = "dados_empresariais"
ativas_db_name = "dados_ativas"

# Check if database exists
if abertas_db_name in couch and ativas_db_name in couch:
    db = couch[abertas_db_name]
    db_ativas = couch[ativas_db_name]
    # print(db_ativas)

else:
    print(f"O banco de dados '{abertas_db_name}' não existe.")
    exit()

app = Flask(__name__)
CORS(app)

API_TOKEN = os.getenv("API_TOKEN")

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

        # Resposta de sucesso - trata tanto códigos IBGE quanto "total"
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

@app.route("/data_atualizacao", methods=["GET"])
@token_required
def buscar_data_atualizacao():
    try:
        mes = request.args.get("mes")  # Ex: "12"
        ano = request.args.get("ano")  # Ex: "2025"

        if not all([mes, ano]):
            return jsonify({
                "error": "Parâmetros 'mes' e 'ano' são obrigatórios"
            }), 400

        db_name = "dados_ativas"
        if db_name not in couch:
            return jsonify({
                "error": f"Banco de dados '{db_name}' não existe"
            }), 404

        db = couch[db_name]
        doc_id = f"{mes.zfill(2)}-{ano}"

        if doc_id not in db:
            return jsonify({
                "error": f"Documento {doc_id} não encontrado"
            }), 404

        doc = db[doc_id]

        if "dataAtualizacao" not in doc:
            return jsonify({
                "error": "Campo 'dataAtualizacao' não encontrado no documento"
            }), 404

        return jsonify({
            "id": doc_id,
            "dataAtualizacao": doc["dataAtualizacao"]
        })

    except couchdb.http.Unauthorized:
        return jsonify({"error": "Acesso não autorizado ao CouchDB"}), 401
    except Exception as e:
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
        # print(doc)
        
        # Verifica se a cidade existe no documento
        if cidade not in doc:
            return (
                jsonify({"error": f"Cidade {cidade} não encontrada no documento"}),
                404,
            )
        
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


@app.route("/id_nome_cidades", methods=["GET"])
@token_required
def get_id_nome_cidades():
    DB_NAME = 'filtros'
    db = couch[DB_NAME]
    DOC_ID = 'cidades_piaui'

    try:
        # Buscar o documento pelo ID
        doc = db.get(DOC_ID)
        
        if not doc:
            return jsonify({"error": "Documento não encontrado"}), 404
        
        # Formatar os dados no formato desejado
        cidades = []
        for cidade_id, cidade_data in doc["cidades"].items():
            cidades.append({
                "id": int(cidade_id),
                "nome": cidade_data["nome"]
            })
        
        # Retornar como JSON com encoding UTF-8
        return Response(
            json.dumps(cidades, ensure_ascii=False),
            mimetype='application/json; charset=utf-8'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/data_recente')
@token_required
def rtorna_data_mais_recente():
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

@app.route("/primeiro_ranking", methods=["GET"])
@token_required
def buscar_primeiro_ranking():
    try:
        # Obtém parâmetros da URL
        mes = request.args.get("mes")  # Ex: "12"
        ano = request.args.get("ano")  # Ex: "2024"

        # Validação básica
        if not all([mes, ano]):
            return (
                jsonify(
                    {"error": "Parâmetros 'mes' e 'ano' são obrigatórios"}
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

        # Procura pelo município em primeira posição
        primeiro_municipio = None
        codigo_primeiro = None
        
        for codigo_municipio, dados_municipio in doc.items():
            # Ignora campos que não são municípios (como "total" ou outros metadados)
            if isinstance(dados_municipio, dict) and "ranking" in dados_municipio:
                ranking = dados_municipio.get("ranking", {})
                posicao = ranking.get("posicao")
                
                if posicao == 1:
                    primeiro_municipio = dados_municipio
                    codigo_primeiro = codigo_municipio
                    break

        # Verifica se encontrou o primeiro colocado
        if primeiro_municipio is None:
            return jsonify({
                "error": f"Nenhum município encontrado em primeiro lugar no ranking para {mes}/{ano}"
            }), 404

        # Resposta de sucesso
        return jsonify({
            "id": doc_id,
            "municipio": primeiro_municipio["nome"],
            "tipo": "municipio", 
            **doc[codigo_primeiro]
        })



    except couchdb.http.Unauthorized:
        return jsonify({"error": "Acesso não autorizado ao CouchDB"}), 401
    except Exception as e:
        # Log do erro real (aparece no terminal onde o Flask está rodando)
        app.logger.error(f"Erro interno: {str(e)}", exc_info=True)
        return jsonify({"error": "Erro interno no servidor"}), 500
    

@app.route("/ranking_aberturas", methods=["GET"])
@token_required
def buscar_ranking_completo():
    """
        "portes": {
        "Microempreendedor Individual": 3507,
        "Microempresa": 817,
        "Empresa de pequeno porte": 156,
        "Demais": 46
      },
    """
    mes = request.args.get("mes")
    ano = request.args.get("ano")
    
    db = couch["dados_empresariais"]
    doc_id = f"{mes.zfill(2)}-{ano}"
    doc = db.get(doc_id)

    if not doc:
        return jsonify({"error": "Dados não encontrados"}), 404

    ranking = []
    for chave, valor in doc.items():
        # Filtra apenas o que for município (ignora campos de sistema do CouchDB)
        if isinstance(valor, dict) and "ranking" in valor:
            ranking.append({
                "municipio": valor.get("nome"),
                "codigo": chave,
                "quantidade": sum(valor.get("abertas", {}).get("portes", {}).values()), 
            })

    # Ordena pela quantidade de aberturas
    ranking_ordenado = sorted(ranking, key=lambda x: x['quantidade'], reverse=True)

    # Adiciona a posição no ranking
    ranking_ordenado = [
        {**item, "posicao": idx + 1} for idx, item in enumerate(ranking_ordenado)
    ]
    
    return jsonify(ranking_ordenado)

    
@app.route("/ranking_ativas", methods=["GET"])
@token_required
def buscar_ranking_ativas():
    mes = request.args.get("mes")
    ano = request.args.get("ano")
    
    db = couch["dados_ativas"]
    doc_id = f"{mes.zfill(2)}-{ano}"
    doc = db.get(doc_id)

    if not doc:
        return jsonify({"error": "Dados não encontrados"}), 404

    ranking = []
    for chave, valor in doc.items():
        # Verifica se é um objeto de município válido
        if isinstance(valor, dict) and "nome" in valor and valor["nome"].lower() != "piauí":
            # Soma o estoque de ATIVAS
            quantidade = sum(valor.get("ativas", {}).get("portes", {}).values())
            
            ranking.append({
                "municipio": valor.get("nome"),
                "codigo": chave,
                "quantidade": quantidade, 
            })

    # Ordena pelo estoque (maior para menor)
    ranking_ordenado = sorted(ranking, key=lambda x: x['quantidade'], reverse=True)
    
    # Adiciona a posição 1º, 2º...
    ranking_final = [{**item, "posicao": idx + 1} for idx, item in enumerate(ranking_ordenado)]
    
    return jsonify(ranking_final)

if __name__ == "__main__":
    app.run()
