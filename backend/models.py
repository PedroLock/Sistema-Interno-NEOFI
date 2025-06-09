from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class ClienteBase(BaseModel):
    nome: str
    cpf_cnpj: str
    telefone: Optional[str] = None
    email: Optional[EmailStr] = None
    status: str = "Ativo"

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(ClienteBase):
    pass

class ClienteDB(ClienteBase):
    id: str
    data_entrada: Optional[datetime]
    ultima_movimentacao: Optional[datetime]

class OperacaoBase(BaseModel):
    cliente_id: str
    tipo: str
    valor: float
    status: str
    data_inicio: Optional[datetime] = None
    data_fim: Optional[datetime] = None
    observacao: Optional[str] = None

class OperacaoCreate(OperacaoBase):
    pass

class OperacaoUpdate(OperacaoBase):
    pass

class OperacaoDB(OperacaoBase):
    id: str 