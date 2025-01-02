import couchdb
from urllib.parse import quote
import json
from flask import Flask, jsonify
from flask_cors import CORS

password = 'sti@JUCEPI_2020'
encoded_password = quote(password)

couch = couchdb.Server(f'http://admin:{encoded_password}@10.40.25.11:5984/')

db_name = 'test'  # nome do banco

# verifica se existe
if db_name in couch:
    db = couch[db_name]
else:
    print(f"O banco de dados '{db_name}' não existe.")
    exit()

# 35299b45e7ec1d69564f1a0b5e00cbdd - id do documento desejado
# doc = db['35299b45e7ec1d69564f1a0b5e00cbdd']
doc = db['35299b45e7ec1d69564f1a0b5e012a92']

app = Flask(__name__)
CORS(app) # necessário pra api

# retorna um array com todas as cidades
@app.route('/cidades')
def get_all_cidades():
    cidades = []
    # doc = db['35299b45e7ec1d69564f1a0b5e00cbdd']
    doc = db['35299b45e7ec1d69564f1a0b5e012a92']

    for cidade in doc['cidades']:
        cidades.append(cidade['nome'])
    return jsonify(cidades)

@app.route('/cidades/<int:cidade_id>')
def get_one_cidade(cidade_id):
    cidades = []
    # doc = db['35299b45e7ec1d69564f1a0b5e00cbdd']
    doc = db['35299b45e7ec1d69564f1a0b5e012a92']

    for cidade in doc['cidades']:
        print(cidade['id'])
        if int(cidade['id']) == int(cidade_id):
            return jsonify(cidade)
    else:
        return jsonify({'message': 'Cidade não encontrada'}), 404


    # for cidade in doc['cidades']:
    #     cidades.append(cidade['nome'])
    # return jsonify(cidades)

# retorna todos os dados, dicionário completo
@app.route('/dados')
def get_all_data():
    # doc = db['35299b45e7ec1d69564f1a0b5e00cbdd']
    doc = db['35299b45e7ec1d69564f1a0b5e012a92']
    return jsonify(doc['cidades'])

if __name__ == '__main__':
    app.run(debug=True)

# print(doc['data'])

# quando é direto
# for cidade in doc['cidades']:
#     print(f"\nCidade: {cidade['nome']}")

#     # Iterando sobre as naturezas
#     print("Naturezas:")
#     for natureza in cidade['naturezas']:
#         print(f"  - {natureza['tipo']}: {natureza['qtd']}")

#     # Iterando sobre os portes (e assim por diante para outras categorias)
#     print("Portes:")
#     for porte in cidade['portes']:
#         print(f"  - {porte['tipo']}: {porte['qtd']}")

#     print("Atividades:")
#     for atividade in cidade['atividades']:
#         print(f"  - {atividade['tipo']}: {atividade['qtd']}")

#     print("Tempo de análise:")
#     for porte in cidade['tempo_analise']:
#         print(f"  - {porte['tipo']}: {porte['valor']}")

#     print("Tempo de resposta:")
#     for porte in cidade['tempo_resposta']:
#         print(f"  - {porte['tipo']}: {porte['valor']}")


# # Itere sobre os documentos no banco de dados
# for doc_id in db:
#     print(f"Document ID: {doc_id}")

# all_docs = []
# for doc_id in db:
#     doc = db[doc_id]
#     all_docs.append(doc)
# print(jsonify(all_docs))

    # ... e assim por diante para as outras categorias
# print(doc['data'])


# db1 = couch.create('test') # newly created

# municipios = pd.read_json("data/munivipios.json")

# for municipio in municipios:
#     db.save(doc)

# with open("data/municipios.json", "r", encoding="utf-8") as file:
#     municipios = json.load(file)
#     db1.save(municipios)

# # Inserir cada município no banco de dados
# for municipio in municipios:
#     db1.save(municipio)
#     print(f"Municipio {municipio['municipio']} inserido com sucesso.")


# @app.route('/municipios/<municipio_id>')
# def get_municipio(municipio_id):
#     try:
#         doc = db[municipio_id]
#         return jsonify(doc)
#     except couchdb.http.ResourceNotFound:
#         return jsonify({'error': 'Municipio não encontrado'}), 404

