import React, { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import { Box, Typography, Button, List, ListItem, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Snackbar, Alert, TextField, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Operacoes() {
  const navigate = useNavigate();
  const { clienteId } = useParams();
  const [operacoes, setOperacoes] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [novoTipo, setNovoTipo] = useState('');
  const [novoOp, setNovoOp] = useState({ valor: '', status: 'Pendente', data_inicio: '', data_fim: '', observacao: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    axios.get('http://localhost:8000/operacoes')
      .then(res => setOperacoes(res.data))
      .catch(() => setOperacoes([]));
    axios.get(`http://localhost:8000/clientes/${clienteId}`)
      .then(res => setCliente(res.data))
      .catch(() => setCliente(null));
  }, [clienteId]);

  const operacoesCliente = operacoes.filter(op => op.cliente_id === clienteId);

  const handleLogout = () => {
    localStorage.removeItem('neofi_auth');
    navigate('/');
  };

  const handleAbrirModal = (tipo) => {
    setNovoTipo(tipo);
    setNovoOp({ valor: '', status: 'Pendente', data_inicio: '', data_fim: '', observacao: '' });
    setOpenModal(true);
  };

  const handleFecharModal = () => setOpenModal(false);

  const handleChangeOp = (e) => setNovoOp({ ...novoOp, [e.target.name]: e.target.value });

  const handleSalvarOp = async () => {
    try {
      await axios.post('http://localhost:8000/operacoes', {
        ...novoOp,
        tipo: novoTipo,
        cliente_id: clienteId,
      });
      setSnackbar({ open: true, message: 'Operação cadastrada com sucesso!', severity: 'success' });
      setOpenModal(false);
      setNovoTipo('');
      setNovoOp({ valor: '', status: 'Pendente', data_inicio: '', data_fim: '', observacao: '' });
      // Atualiza lista
      axios.get('http://localhost:8000/operacoes')
        .then(res => setOperacoes(res.data))
        .catch(() => setOperacoes([]));
    } catch {
      setSnackbar({ open: true, message: 'Erro ao cadastrar operação.', severity: 'error' });
    }
  };

  return (
    <Box>
      <Topbar />
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Menu lateral */}
        <Box sx={{ width: 250, bgcolor: '#fafafa', borderRight: '1px solid #eee', p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>ADICIONAR MOVIMENTAÇÃO</Typography>
          <List>
            <ListItem button onClick={() => handleAbrirModal('DÍVIDA')}><ListItemText primary="DÍVIDA" /></ListItem>
            <ListItem button onClick={() => handleAbrirModal('RENDA FIXA ENOR')}><ListItemText primary="RENDA FIXA ENOR" /></ListItem>
            <ListItem button onClick={() => handleAbrirModal('AAVE')}><ListItemText primary="AAVE" /></ListItem>
            <ListItem button onClick={() => handleAbrirModal('IMÓVEL')}><ListItemText primary="IMÓVEL" /></ListItem>
          </List>
        </Box>
        {/* Painel principal */}
        <Box sx={{ flex: 1, bgcolor: '#aaa', p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" color="#fff">
              Operações{cliente ? ` de ${cliente.nome}` : ''}
            </Typography>
            <Box>
              <Button variant="outlined" color="info" sx={{ mr: 2 }} onClick={() => setOpenInfo(true)}>
                Ver informações do cliente
              </Button>
              <Button variant="contained" color="primary">
                Adicionar Operação
              </Button>
            </Box>
          </Box>
          {operacoesCliente.length === 0 ? (
            <Typography variant="h6" color="#fff" align="center" sx={{ mt: 8 }}>
              Nenhuma operação encontrada para este cliente.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ maxWidth: 800, mx: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data Início</TableCell>
                    <TableCell>Data Fim</TableCell>
                    <TableCell>Observação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {operacoesCliente.map((op) => (
                    <TableRow key={op.id}>
                      <TableCell>{op.tipo}</TableCell>
                      <TableCell>{op.valor}</TableCell>
                      <TableCell>{op.status}</TableCell>
                      <TableCell>{op.data_inicio ? new Date(op.data_inicio).toLocaleString('pt-BR') : ''}</TableCell>
                      <TableCell>{op.data_fim ? new Date(op.data_fim).toLocaleString('pt-BR') : ''}</TableCell>
                      <TableCell>{op.observacao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
        <Modal open={openInfo} onClose={() => setOpenInfo(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 350, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Informações do Cliente</Typography>
            {cliente ? (
              <>
                <Typography><b>Nome:</b> {cliente.nome}</Typography>
                <Typography><b>CPF/CNPJ:</b> {cliente.cpf_cnpj}</Typography>
                <Typography><b>Telefone:</b> {cliente.telefone}</Typography>
                <Typography><b>Email:</b> {cliente.email}</Typography>
                <Typography><b>Status:</b> {cliente.status}</Typography>
              </>
            ) : (
              <Typography>Carregando informações...</Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={() => setOpenInfo(false)}>Fechar</Button>
            </Box>
          </Box>
        </Modal>
        <Modal open={openModal} onClose={handleFecharModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Nova Operação: {novoTipo}</Typography>
            <TextField fullWidth margin="normal" label="Valor" name="valor" value={novoOp.valor} onChange={handleChangeOp} />
            <TextField fullWidth margin="normal" select label="Status" name="status" value={novoOp.status} onChange={handleChangeOp}>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Concluída">Concluída</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </TextField>
            <TextField fullWidth margin="normal" label="Data Início" name="data_inicio" type="datetime-local" value={novoOp.data_inicio} onChange={handleChangeOp} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth margin="normal" label="Data Fim" name="data_fim" type="datetime-local" value={novoOp.data_fim} onChange={handleChangeOp} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth margin="normal" label="Observação" name="observacao" value={novoOp.observacao} onChange={handleChangeOp} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleFecharModal} sx={{ mr: 1 }}>Cancelar</Button>
              <Button variant="contained" color="primary" onClick={handleSalvarOp}>Salvar</Button>
            </Box>
          </Box>
        </Modal>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Operacoes; 