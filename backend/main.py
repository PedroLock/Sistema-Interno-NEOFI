from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from db import db
from models import ClienteCreate, ClienteUpdate, OperacaoCreate, OperacaoUpdate
from bson import ObjectId
from datetime import datetime

load_dotenv()

app = FastAPI()

# CORS para permitir acesso do frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def cliente_helper(cliente) -> dict:
    return {
        "id": str(cliente["_id"]),
        "nome": cliente["nome"],
        "cpf_cnpj": cliente["cpf_cnpj"],
        "telefone": cliente.get("telefone"),
        "email": cliente.get("email"),
        "status": cliente.get("status", "Ativo"),
        "data_entrada": cliente.get("data_entrada"),
        "ultima_movimentacao": cliente.get("ultima_movimentacao"),
    }

def operacao_helper(operacao) -> dict:
    return {
        "id": str(operacao["_id"]),
        "cliente_id": str(operacao["cliente_id"]),
        "tipo": operacao["tipo"],
        "valor": operacao["valor"],
        "status": operacao["status"],
        "data_inicio": operacao.get("data_inicio"),
        "data_fim": operacao.get("data_fim"),
        "observacao": operacao.get("observacao"),
    }

@app.get("/")
def read_root():
    return {"msg": "API NEOFI rodando!"}

@app.get("/clientes")
def listar_clientes():
    clientes = []
    for c in db.clientes.find():
        clientes.append(cliente_helper(c))
    return clientes

@app.post("/clientes")
def criar_cliente(cliente: ClienteCreate):
    # Verifica duplicidade de CPF/CNPJ
    cpf_cnpj_limpo = ''.join(filter(str.isdigit, cliente.cpf_cnpj))
    existente = db.clientes.find_one({
        "$expr": {
            "$eq": [
                { "$replaceAll": { "input": "$cpf_cnpj", "find": ".", "replacement": "" } },
                cpf_cnpj_limpo
            ]
        }
    })
    if existente:
        raise HTTPException(status_code=400, detail="Já existe um cliente com este CPF/CNPJ.")
    data = cliente.dict()
    data["data_entrada"] = datetime.utcnow()
    data["ultima_movimentacao"] = datetime.utcnow()
    res = db.clientes.insert_one(data)
    novo = db.clientes.find_one({"_id": res.inserted_id})
    return cliente_helper(novo)

@app.get("/clientes/{cliente_id}")
def obter_cliente(cliente_id: str):
    c = db.clientes.find_one({"_id": ObjectId(cliente_id)})
    if not c:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return cliente_helper(c)

@app.put("/clientes/{cliente_id}")
def atualizar_cliente(cliente_id: str, cliente: ClienteUpdate):
    data = cliente.dict(exclude_unset=True)
    data["ultima_movimentacao"] = datetime.utcnow()
    res = db.clientes.update_one({"_id": ObjectId(cliente_id)}, {"$set": data})
    if res.modified_count == 0:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    c = db.clientes.find_one({"_id": ObjectId(cliente_id)})
    return cliente_helper(c)

@app.delete("/clientes/{cliente_id}")
def remover_cliente(cliente_id: str):
    res = db.clientes.delete_one({"_id": ObjectId(cliente_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return {"msg": "Cliente removido"}

@app.get("/operacoes")
def listar_operacoes():
    operacoes = []
    for o in db.operacoes.find():
        operacoes.append(operacao_helper(o))
    return operacoes

@app.post("/operacoes")
def criar_operacao(operacao: OperacaoCreate):
    data = operacao.dict()
    data["cliente_id"] = ObjectId(data["cliente_id"])
    data["data_inicio"] = data.get("data_inicio") or datetime.utcnow()
    res = db.operacoes.insert_one(data)
    novo = db.operacoes.find_one({"_id": res.inserted_id})
    return operacao_helper(novo)

@app.get("/operacoes/{operacao_id}")
def obter_operacao(operacao_id: str):
    o = db.operacoes.find_one({"_id": ObjectId(operacao_id)})
    if not o:
        raise HTTPException(status_code=404, detail="Operação não encontrada")
    return operacao_helper(o)

@app.put("/operacoes/{operacao_id}")
def atualizar_operacao(operacao_id: str, operacao: OperacaoUpdate):
    data = operacao.dict(exclude_unset=True)
    res = db.operacoes.update_one({"_id": ObjectId(operacao_id)}, {"$set": data})
    if res.modified_count == 0:
        raise HTTPException(status_code=404, detail="Operação não encontrada")
    o = db.operacoes.find_one({"_id": ObjectId(operacao_id)})
    return operacao_helper(o)

@app.delete("/operacoes/{operacao_id}")
def remover_operacao(operacao_id: str):
    res = db.operacoes.delete_one({"_id": ObjectId(operacao_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Operação não encontrada")
    return {"msg": "Operação removida"} 