# Sistema Interno NEOFI

## Estrutura do Projeto

- `/backend` — API em Python (FastAPI) conectada ao MySQL
- `/frontend` — Aplicação React customizada com as cores da sua logo

## Como rodar o projeto

### Pré-requisitos
- Python 3.9+
- Node.js 18+
- MySQL 8+

### 1. Backend (FastAPI)
```sh
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Configure as variáveis de ambiente
uvicorn main:app --reload
```

### 2. Frontend (React)
```sh
cd frontend
npm install
npm start
```

### 3. Banco de Dados
- Crie um banco MySQL chamado `neofi`.
- Configure usuário/senha no arquivo `.env` do backend.
- Rode os scripts de migração (serão fornecidos).

---

## Funcionalidades
- Login/Logout
- Cadastro e gestão de clientes
- Gestão de operações/relatórios
- Dashboard

---

## Observações
- O projeto está pronto para futuras integrações de API.
- Layout customizado com as cores da sua logo. 