import couchdb
from urllib.parse import quote
import json
from flask import Flask, jsonify
from flask_cors import CORS

# Database connection setup
password = 'sti@JUCEPI_2020'
encoded_password = quote(password)
couch = couchdb.Server(f'http://admin:admin@localhost:5984/')
db_name = 'test2'

# Check if database exists
if db_name in couch:
    db = couch[db_name]
else:
    print(f"O banco de dados '{db_name}' não existe.")
    exit()

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True)