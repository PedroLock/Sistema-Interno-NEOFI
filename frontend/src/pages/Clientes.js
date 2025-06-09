import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Topbar from '../components/Topbar';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Modal, Radio, RadioGroup, FormControlLabel, FormLabel, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert, IconButton, Menu } from '@mui/material';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState('cpf');
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    cpf_cnpj: '',
    telefone: '',
    email: '',
    status: 'Ativo',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busca, setBusca] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('neofi_auth');
    navigate('/');
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = () => {
    axios.get('http://localhost:8000/clientes')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Erro ao buscar clientes:', error));
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditando(false);
    setSelectedCliente(null);
  };
  const handleChange = (e) => {
    setNovoCliente({ ...novoCliente, [e.target.name]: e.target.value });
  };
  const handleTipoDocumento = (e) => {
    setTipoDocumento(e.target.value);
    setNovoCliente({ ...novoCliente, cpf_cnpj: '' });
  };

  // Máscaras
  const cpfMask = '999.999.999-99';
  const cnpjMask = '99.999.999/9999-99';
  const telefoneMask = '(99) 99999-9999';

  function capitalizeName(name) {
    if (!name) return '';
    const lowerWords = ['de', 'da', 'do', 'e'];
    return name
      .toLowerCase()
      .split(' ')
      .map((word, idx) => {
        if (idx !== 0 && lowerWords.includes(word)) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  const handleEditar = () => {
    if (selectedCliente) {
      setNovoCliente({
        nome: selectedCliente.nome,
        cpf_cnpj: selectedCliente.cpf_cnpj,
        telefone: selectedCliente.telefone,
        email: selectedCliente.email,
        status: selectedCliente.status,
      });
      setTipoDocumento(selectedCliente.cpf_cnpj.length > 14 ? 'cnpj' : 'cpf');
      setEditando(true);
      setOpenModal(true);
      handleMenuClose();
    }
  };

  const handleSalvarCliente = async () => {
    // Verifica duplicidade de CPF/CNPJ apenas se for novo cadastro
    if (!editando) {
      const existe = clientes.some(
        (c) => c.cpf_cnpj.replace(/\D/g, '') === novoCliente.cpf_cnpj.replace(/\D/g, '')
      );
      if (existe) {
        setSnackbar({ open: true, message: 'Já existe um cliente com este CPF/CNPJ.', severity: 'error' });
        return;
      }
    }
    try {
      if (editando && selectedCliente) {
        await axios.put(`http://localhost:8000/clientes/${selectedCliente.id}`, novoCliente);
        setSnackbar({ open: true, message: 'Cliente atualizado com sucesso!', severity: 'success' });
      } else {
        await axios.post('http://localhost:8000/clientes', novoCliente);
        setSnackbar({ open: true, message: 'Cliente cadastrado com sucesso!', severity: 'success' });
      }
      setOpenModal(false);
      setNovoCliente({ nome: '', cpf_cnpj: '', telefone: '', email: '', status: 'Ativo' });
      setEditando(false);
      setSelectedCliente(null);
      fetchClientes();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao salvar cliente.', severity: 'error' });
    }
  };

  const handleMenuOpen = (event, cliente) => {
    setAnchorEl(event.currentTarget);
    setSelectedCliente(cliente);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExcluir = () => {
    setConfirmDelete(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (selectedCliente) {
      try {
        await axios.delete(`http://localhost:8000/clientes/${selectedCliente.id}`);
        setSnackbar({ open: true, message: 'Cliente removido com sucesso!', severity: 'success' });
        setConfirmDelete(false);
        setSelectedCliente(null);
        fetchClientes();
      } catch (error) {
        setSnackbar({ open: true, message: 'Erro ao remover cliente.', severity: 'error' });
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setSelectedCliente(null);
  };

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    const hora = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = busca.replace(/\D/g, '');
    const doc = (cliente.cpf_cnpj || '').replace(/\D/g, '');
    return doc.includes(termo);
  });

  const handleVerOperacao = (clienteId) => {
    navigate(`/operacoes/${clienteId}`);
  };

  return (
    <Box>
      <Topbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>Lista de Clientes</Typography>
        <Box sx={{ mb: 2, textAlign: 'right' }}>
          <TextField label="Buscar por CPF/CNPJ" size="small" sx={{ width: 220 }} value={busca} onChange={e => setBusca(e.target.value)} />
        </Box>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF/CNPJ</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data de Entrada</TableCell>
                <TableCell>Última Mov.</TableCell>
                <TableCell>Ver Operação</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{capitalizeName(cliente.nome)}</TableCell>
                  <TableCell>{cliente.cpf_cnpj}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.status}</TableCell>
                  <TableCell>{formatDate(cliente.data_entrada)}</TableCell>
                  <TableCell>{formatDate(cliente.ultima_movimentacao)}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleVerOperacao(cliente.id)}>Ver Operação</Button>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleMenuOpen(e, cliente)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditar}>Editar</MenuItem>
          <MenuItem onClick={handleExcluir}>Excluir</MenuItem>
        </Menu>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>Adicionar Novo Cliente</Button>
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>{editando ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="tipo-doc-label">Tipo de Documento</InputLabel>
              <Select
                labelId="tipo-doc-label"
                label="Tipo de Documento"
                value={tipoDocumento}
                onChange={handleTipoDocumento}
              >
                <MenuItem value="cpf">CPF</MenuItem>
                <MenuItem value="cnpj">CNPJ</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth margin="normal" label="Nome" name="nome" value={novoCliente.nome} onChange={handleChange} />
            <InputMask
              mask={tipoDocumento === 'cpf' ? cpfMask : cnpjMask}
              value={novoCliente.cpf_cnpj}
              onChange={handleChange}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  fullWidth
                  margin="normal"
                  label={tipoDocumento === 'cpf' ? 'CPF' : 'CNPJ'}
                  name="cpf_cnpj"
                />
              )}
            </InputMask>
            <InputMask
              mask={telefoneMask}
              value={novoCliente.telefone}
              onChange={handleChange}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  fullWidth
                  margin="normal"
                  label="Telefone"
                  name="telefone"
                />
              )}
            </InputMask>
            <TextField fullWidth margin="normal" label="Email" name="email" value={novoCliente.email} onChange={handleChange} />
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                name="status"
                value={novoCliente.status}
                onChange={handleChange}
              >
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Inativo">Inativo</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleCloseModal} sx={{ mr: 1 }}>Cancelar</Button>
              <Button variant="contained" color="primary" onClick={handleSalvarCliente}>{editando ? 'Salvar Alterações' : 'Salvar'}</Button>
            </Box>
          </Box>
        </Modal>
        <Modal open={confirmDelete} onClose={handleCancelDelete}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 350, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Confirmar Exclusão</Typography>
            <Typography sx={{ mb: 3 }}>Tem certeza que deseja remover o cliente <b>{selectedCliente?.nome?.toUpperCase()}</b>?</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancelDelete} sx={{ mr: 1 }}>Cancelar</Button>
              <Button variant="contained" color="error" onClick={handleConfirmDelete}>Remover</Button>
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

export default Clientes; 