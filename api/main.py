import couchdb
from urllib.parse import quote
import json
from flask import Flask, jsonify, Response, request
from flask_cors import CORS

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

# lista de todos os ids
@app.route('/cidades_key')
def get_all_id_cidades():
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    # print(doc)
    
    return jsonify(list(doc['cidades'].keys()))

# lista de todos os nomes de cidades
@app.route('/cidades')
def get_all_cidades():
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    
    # Extrai os nomes das cidades
    nomes_cidades = [cidade_data['nome'] for cidade_id, cidade_data in doc['cidades'].items()]
    
    return jsonify(nomes_cidades)

# retorna o nome e o id das cidades em um object
@app.route('/id_nome_cidades', methods=['GET'])
def get_id_nome_cidades():
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    
    # Formata os dados no formato desejado
    cidades = [{"id": int(cidade_id), "nome": cidade_data['nome']} 
               for cidade_id, cidade_data in doc['cidades'].items()]
    
    # Gera o JSON com UTF-8 explicitamente configurado
    response = Response(json.dumps(cidades, ensure_ascii=False), content_type='application/json; charset=utf-8')
    return response

# Return all city names with their data
@app.route('/dados')
def get_all_data():
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    return jsonify(doc['cidades'])

# Get data for a specific city
@app.route('/cidade/<codigo>')
def get_cidade_data(codigo):
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    if codigo in doc['cidades']:
        return jsonify(doc['cidades'][codigo])
    return jsonify({"error": "Cidade não encontrada"}), 404

# Get all naturezas for a specific city
@app.route('/cidade/<codigo>/naturezas')
def get_naturezas(codigo):
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    if codigo in doc['cidades']:
        return jsonify(doc['cidades'][codigo]['naturezas'])
    return jsonify({"error": "Cidade não encontrada"}), 404

# Get all portes for a specific city
@app.route('/cidade/<codigo>/portes')
def get_portes(codigo):
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    if codigo in doc['cidades']:
        return jsonify(doc['cidades'][codigo]['portes'])
    return jsonify({"error": "Cidade não encontrada"}), 404

# Get all atividades for a specific city
@app.route('/cidade/<codigo>/atividades')
def get_atividades(codigo):
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    if codigo in doc['cidades']:
        return jsonify(doc['cidades'][codigo]['atividades'])
    return jsonify({"error": "Cidade não encontrada"}), 404

# Get data and month
@app.route('/info')
def get_data():
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    return jsonify({"data": doc['data']})

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
    doc = db['35299b45e7ec1d69564f1a0b5e01a3bb']
    
    # Verifica se a data do documento é a data procurada
    if doc.get('data') != data_procurada:
        return jsonify({"error": "Dados não encontrados para o mês/ano especificado"}), 404
    
    # Procura pela cidade especificada
    cidade_encontrada = doc['cidades'].get(cidade)
    # print(cidade_encontrada)
    if not cidade_encontrada:
        return jsonify({"error": "Cidade não encontrada"}), 404

    cidade_encontrada['id'] = cidade
    cidade_encontrada['data'] = data_procurada
    
    # Retorna os dados com charset UTF-8 no cabeçalho Content-Type
    response = jsonify(cidade_encontrada)
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response

if __name__ == '__main__':
    app.run(debug=True)