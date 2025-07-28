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
    print(db_ativas)

else:
    print(f"O banco de dados '{abertas_db_name}' não existe.")
    exit()

app = Flask(__name__)
CORS(app)


@app.route("/empresas_abertas", methods=["GET"])
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


@app.route("/empresas_ativas", methods=["GET"])
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


@app.route("/id_nome_cidades", methods=["GET"])
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
            # Se for o total, mantém o ID como string
            if cidade_id == "total":
                cidades.append({
                    "id": cidade_id,
                    "nome": cidade_data["nome"]
                })
            else:
                # Para cidades normais, converte o ID para inteiro
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
